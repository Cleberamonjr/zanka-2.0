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
  TELEGRAM_TOKEN, TELEGRAM_CHAT,
  RESEND_KEY, RESEND_FROM,
  GH_PAT, GITHUB_OWNER
} = process.env;
const GH_OWNER = GITHUB_OWNER || 'Cleberamonjr';

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
        + `Use só ids do elenco. 2 a 5 sub-tarefas. Não invente dados.\n`
        + `AÇÕES REAIS disponíveis (use quando fizer sentido): enviar_email (payload: para, assunto, corpo — pede aprovação), `
        + `github_ler (payload: repo, path — livre), github_alterar (payload: repo, path, conteudo, mensagem — pede aprovação). `
        + `Delegue github_* ao hector.\n\nELENCO:\n${ELENCO}` + await memoria('zanka', projeto);
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

    // ── AÇÃO REAL: enviar e-mail via Resend (trava dura: só sai aprovado) ──
    if (t.acao === 'enviar_email') {
      if (!t.aprovado_por) {
        await sb(`tarefas?id=eq.${t.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'aguardando_aprovacao' }) });
        resultados.push({ id: t.id, agente: t.agente || 'aninha', acao: 'enviar_email', status: 'aguardando_aprovacao' });
        continue;
      }
      if (!RESEND_KEY || String(RESEND_KEY).startsWith('COLE')) throw new Error('RESEND_KEY nao configurada nos secrets');
      const p = t.payload || {};
      const r = await fetch('https://api.resend.com/emails', { method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: p.de || RESEND_FROM || 'onboarding@resend.dev', to: p.para, subject: p.assunto || '(sem assunto)', html: p.corpo || p.html || p.texto || '' }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error('Resend HTTP ' + r.status + ': ' + JSON.stringify(d).slice(0, 150));
      await sb(`tarefas?id=eq.${t.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'feito', resultado: { enviado: true, id: d.id, para: p.para } }) });
      await sb('eventos', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ agente: t.agente || 'aninha', tipo: 'acao', mensagem: `e-mail enviado para ${p.para}`, tarefa_id: t.id }) });
      resultados.push({ id: t.id, agente: t.agente || 'aninha', acao: 'enviar_email', status: 'feito', para: p.para });
      continue;
    }

    // ── GITHUB: LER (livre, sem aprovação) ──
    if (t.acao === 'github_ler') {
      if (!GH_PAT || String(GH_PAT).startsWith('COLE')) throw new Error('GH_PAT nao configurado nos secrets');
      const p = t.payload || {};
      const repo = p.repo; const caminho = p.path || p.caminho || '';
      const gr = await fetch(`https://api.github.com/repos/${GH_OWNER}/${repo}/contents/${caminho}${p.branch ? '?ref=' + p.branch : ''}`,
        { headers: { Authorization: `Bearer ${GH_PAT}`, Accept: 'application/vnd.github+json', 'User-Agent': 'zanka-worker' } });
      const gd = await gr.json();
      if (!gr.ok) throw new Error('GitHub ' + gr.status + ': ' + JSON.stringify(gd).slice(0, 150));
      let conteudo;
      if (Array.isArray(gd)) conteudo = gd.map(x => `${x.type}: ${x.name}`).join('\n'); // diretório
      else if (gd.content) conteudo = Buffer.from(gd.content, 'base64').toString('utf-8').slice(0, 4000); // arquivo
      else conteudo = JSON.stringify(gd).slice(0, 1000);
      await sb(`tarefas?id=eq.${t.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'feito', resultado: { repo, caminho, conteudo } }) });
      await sb('eventos', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ agente: t.agente || 'hector', tipo: 'acao', mensagem: `leu ${repo}/${caminho}`, tarefa_id: t.id }) });
      resultados.push({ id: t.id, agente: t.agente || 'hector', acao: 'github_ler', status: 'feito' });
      continue;
    }

    // ── GITHUB: ALTERAR (escrita — trava dura de aprovação) ──
    if (t.acao === 'github_alterar') {
      if (!t.aprovado_por) {
        await sb(`tarefas?id=eq.${t.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'aguardando_aprovacao' }) });
        resultados.push({ id: t.id, agente: t.agente || 'hector', acao: 'github_alterar', status: 'aguardando_aprovacao' });
        continue;
      }
      if (!GH_PAT || String(GH_PAT).startsWith('COLE')) throw new Error('GH_PAT nao configurado nos secrets');
      const p = t.payload || {};
      const repo = p.repo, caminho = p.path || p.caminho, branch = p.branch || 'main';
      // pega o sha se o arquivo já existe (necessário p/ atualizar)
      let sha;
      try {
        const g = await fetch(`https://api.github.com/repos/${GH_OWNER}/${repo}/contents/${caminho}?ref=${branch}`,
          { headers: { Authorization: `Bearer ${GH_PAT}`, Accept: 'application/vnd.github+json', 'User-Agent': 'zanka-worker' } });
        if (g.ok) { const gd = await g.json(); sha = gd.sha; }
      } catch (e) {}
      const corpo = { message: p.mensagem || 'ZANKA: alteração aprovada', content: Buffer.from(String(p.conteudo || ''), 'utf-8').toString('base64'), branch };
      if (sha) corpo.sha = sha;
      const wr = await fetch(`https://api.github.com/repos/${GH_OWNER}/${repo}/contents/${caminho}`,
        { method: 'PUT', headers: { Authorization: `Bearer ${GH_PAT}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'zanka-worker' }, body: JSON.stringify(corpo) });
      const wd = await wr.json();
      if (!wr.ok) throw new Error('GitHub ' + wr.status + ': ' + JSON.stringify(wd).slice(0, 150));
      await sb(`tarefas?id=eq.${t.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'feito', resultado: { commit: wd.commit && wd.commit.sha, caminho } }) });
      await sb('eventos', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ agente: t.agente || 'hector', tipo: 'acao', mensagem: `alterou ${repo}/${caminho}`, tarefa_id: t.id }) });
      resultados.push({ id: t.id, agente: t.agente || 'hector', acao: 'github_alterar', status: 'feito' });
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
