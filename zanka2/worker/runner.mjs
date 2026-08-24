// ═══════════════════════════════════════════════════════════════
// ZANKA 2.0 — WORKER 24/7 (roda no GitHub Actions, sem seu Mac)
// Reusa a orquestração testada + portão de aprovação, e adiciona:
//   • roteamento multi-LLM por agente (GLM / Gemini / DeepSeek) c/ failover
//   • memória compartilhada no Supabase
// Chaves vêm de SECRETS do GitHub (env), nunca do código.
// ═══════════════════════════════════════════════════════════════
import fs from 'node:fs';

const {
  SUPABASE_URL, SUPABASE_SERVICE_ROLE,
  GLM_KEY, GEMINI_KEY, DEEPSEEK_KEY,
  TELEGRAM_TOKEN, TELEGRAM_CHAT
} = process.env;

const MAX_TAREFAS = Number(process.env.MAX_TAREFAS || 6);
const cfg = JSON.parse(fs.readFileSync(new URL('./agents.json', import.meta.url)));
const ROTA = Object.fromEntries(cfg.agentes.map(a => [a.id, a.provider]));
const ELENCO = cfg.agentes.map(a => `- ${a.id}: ${a.nome} — ${a.role}`).join('\n');

// ── Provedores (GLM e DeepSeek são OpenAI-compat; Gemini é nativo) ──
const PROVIDERS = {
  glm:      { key: GLM_KEY,      url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', model: 'glm-4.6',        compat: true },
  deepseek: { key: DEEPSEEK_KEY, url: 'https://api.deepseek.com/chat/completions',              model: 'deepseek-chat', compat: true },
  gemini:   { key: GEMINI_KEY,   url: 'https://generativelanguage.googleapis.com/v1beta/models', model: 'gemini-2.0-flash', compat: false }
};
const temChave = p => PROVIDERS[p] && PROVIDERS[p].key && !String(PROVIDERS[p].key).startsWith('COLE');

async function chamarUm(prov, sys, user) {
  const P = PROVIDERS[prov];
  if (P.compat) {
    const r = await fetch(P.url, { method: 'POST',
      headers: { Authorization: `Bearer ${P.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: P.model, stream: false,
        messages: [{ role: 'system', content: sys }, { role: 'user', content: user }] }) });
    if (!r.ok) throw new Error(`${prov} HTTP ${r.status}`);
    const d = await r.json();
    const t = d?.choices?.[0]?.message?.content;
    if (!t) throw new Error(`${prov} vazio`);
    return t;
  }
  // Gemini nativo
  const r = await fetch(`${P.url}/${P.model}:generateContent?key=${P.key}`, { method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: sys }] },
      contents: [{ role: 'user', parts: [{ text: user }] }] }) });
  if (!r.ok) throw new Error(`gemini HTTP ${r.status}`);
  const d = await r.json();
  const t = d?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!t) throw new Error('gemini vazio');
  return t;
}

// Roteia pelo provider preferido do agente e cai pra cadeia de fallback — nunca fica mudo
async function chamarLLM(agente, sys, user) {
  const pref = ROTA[agente] || 'glm';
  const cadeia = [pref, ...cfg.fallback.filter(p => p !== pref)].filter(temChave);
  if (!cadeia.length) throw new Error('Nenhuma chave de LLM configurada nos secrets.');
  let ultimo;
  for (const prov of cadeia) {
    try { return { texto: await chamarUm(prov, sys, user), provider: prov }; }
    catch (e) { ultimo = e; }
  }
  throw ultimo || new Error('Todos os provedores falharam.');
}

// ── Supabase REST (service_role, server-side) ──
const sb = (path, opts = {}) => fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
  ...opts, headers: { apikey: SUPABASE_SERVICE_ROLE, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
    'Content-Type': 'application/json', ...(opts.headers || {}) } });

async function memoria(agente, projeto = 'geral') {
  try {
    const r = await sb(`memoria?agente=in.(${agente},time)&projeto=eq.${projeto}&select=chave,valor&limit=20`);
    const rows = await r.json();
    if (!Array.isArray(rows) || !rows.length) return '';
    return '\n\n[MEMÓRIA]\n' + rows.map(m => `- ${m.chave}: ${m.valor}`).join('\n');
  } catch { return ''; }
}
async function gravarMemoria(agente, projeto, chave, valor) {
  await sb('memoria?on_conflict=agente,projeto,chave', { method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ agente, projeto, chave, valor }) });
}

const SENSIVEIS = ['outreach','rascunho_outreach','enviar_email','email','whatsapp','dm','disparo','publicar','post_publicar','anuncio','ad','gasto','pagamento','proposta','cold'];
const ehSensivel = a => SENSIVEIS.some(s => String(a || '').toLowerCase().includes(s));

// ══════════════════════ LOOP PRINCIPAL ══════════════════════
const nowIso = new Date().toISOString();
const q = `tarefas?status=eq.pendente&or=(agendado_para.is.null,agendado_para.lte.${nowIso})`
        + `&order=prioridade.asc,criado_em.asc&limit=${MAX_TAREFAS}`;
const pend = await (await sb(q)).json();
const resultados = [];

for (const t of (Array.isArray(pend) ? pend : [])) {
  await sb(`tarefas?id=eq.${t.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'executando' }) });
  const projeto = (t.payload && t.payload.projeto) || 'geral';
  try {
    // ── CAMINHO 1: ZANKA orquestra (90%) ──
    if (t.agente === 'zanka' && (t.acao === 'orquestrar' || t.acao === 'objetivo')) {
      const objetivo = t.payload?.objetivo || t.payload?.texto || JSON.stringify(t.payload || {});
      const sys = `Você é a ZANKA, CEO e orquestradora. Quebre o OBJETIVO em sub-tarefas e delegue ao agente certo. `
        + `Responda APENAS JSON válido, sem markdown: {"plano":[{"agente":"id","acao":"nome_curto","payload":{}}]}. `
        + `Use só ids do elenco. 2 a 5 sub-tarefas. Não invente dados.\n\nELENCO:\n${ELENCO}` + await memoria('zanka', projeto);
      const { texto, provider } = await chamarLLM('zanka', sys, `OBJETIVO: ${objetivo}`);
      let plano = [];
      try { plano = JSON.parse(texto.slice(texto.indexOf('{'), texto.lastIndexOf('}') + 1)).plano || []; } catch {}
      const criadas = [];
      for (const p of plano) {
        if (!p?.agente || !p?.acao) continue;
        const sub = { agente: p.agente, acao: p.acao, payload: { ...(p.payload || {}), projeto }, prioridade: 3, requer_aprovacao: ehSensivel(p.acao), status: 'pendente' };
        await sb('tarefas', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(sub) });
        criadas.push(`${p.agente}/${p.acao}${sub.requer_aprovacao ? ' (aprova)' : ''}`);
      }
      await sb(`tarefas?id=eq.${t.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'feito', resultado: { plano, delegou: criadas, provider } }) });
      await sb('eventos', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ agente: 'zanka', tipo: 'acao', mensagem: `orquestrou: ${criadas.join(', ') || 'vazio'}`, tarefa_id: t.id }) });
      resultados.push({ id: t.id, agente: 'zanka', acao: 'orquestrar', status: 'feito', delegou: criadas, provider });
      continue;
    }

    // ── CAMINHO 2: execução direta do agente (10%) ──
    const sys = `Você é ${String(t.agente).toUpperCase()}, agente da equipe ZANKA. Ação: ${t.acao}. `
      + `Entregue algo objetivo e pronto para uso. Nunca invente dados; se faltar algo, diga o que falta.` + await memoria(t.agente, projeto);
    const { texto, provider } = await chamarLLM(t.agente, sys, JSON.stringify(t.payload || {}));
    const novoStatus = t.requer_aprovacao ? 'aguardando_aprovacao' : 'feito';
    await sb(`tarefas?id=eq.${t.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: novoStatus, resultado: { texto, provider } }) });
    await sb('eventos', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ agente: t.agente, tipo: 'acao', mensagem: `${t.acao} (${provider})`, tarefa_id: t.id }) });
    if (t.acao === 'briefing') await sb('briefings', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ resumo: texto }) });
    resultados.push({ id: t.id, agente: t.agente, acao: t.acao, status: novoStatus, provider });
  } catch (e) {
    await sb(`tarefas?id=eq.${t.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'erro', erro: String(e?.message || e) }) });
    resultados.push({ id: t.id, erro: String(e?.message || e) });
  }
}

if (resultados.length && TELEGRAM_TOKEN && !String(TELEGRAM_TOKEN).startsWith('COLE')) {
  const linhas = resultados.map(r => r.erro ? `⚠️ ${r.id}: ${r.erro}`
    : r.delegou ? `🧠 ZANKA (${r.provider}) delegou: ${r.delegou.join(', ') || '(nada)'}`
    : `✅ ${r.agente}/${r.acao} → ${r.status} [${r.provider}]`).join('\n');
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, { method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT, text: `🌙 ZANKA 2.0 processou ${resultados.length} item(ns):\n${linhas}` }) });
}

console.log(JSON.stringify({ processadas: resultados.length, resultados }, null, 2));
