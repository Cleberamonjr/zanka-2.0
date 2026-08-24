# 🧠 ZANKA 2.0

Central de comando multi-agente do Clebe. **Acordado** você trabalha no cockpit (link);
**dormindo**, o GitHub Actions acorda a equipe, executa a estratégia e te avisa no Telegram.

## Estrutura
```
zanka-2.0/
├─ index.html                → COCKPIT (GitHub Pages) — reaproveitado, já testado
├─ supabase/schema.sql       → fila de tarefas + eventos + briefings + MEMÓRIA
├─ worker/
│  ├─ runner.mjs             → worker 24/7 multi-LLM (GLM/Gemini/DeepSeek)
│  └─ agents.json            → os 17 agentes + qual LLM cada um usa
└─ .github/workflows/zanka-worker.yml → o "batimento" (cron do Actions)
```

## Como o corpo pensa
- **90% ZANKA orquestra:** você deixa um objetivo → a ZANKA quebra em sub-tarefas e delega ao agente certo.
- **10% direto:** você delega a um agente específico.
- **Roteamento por LLM:** raciocínio → DeepSeek · conteúdo → Gemini · BI/volume → GLM. Com failover (nunca fica mudo). Edite em `worker/agents.json`.
- **Portão de aprovação:** o reversível roda livre; venda/gasto/envio externo fica travado até você aprovar.
- **Memória:** agentes leem e gravam aprendizados por projeto no Supabase.

## Setup (só o que depende de você) — ~15 min

**1. Supabase.** SQL Editor → cole `supabase/schema.sql` → Run.

**2. GitHub Pages (o link do cockpit).** Settings → Pages → Deploy from branch → `main` / root.
   O cockpit fica em `https://SEU-USUARIO.github.io/zanka-2.0/`.

**3. Secrets do worker.** Settings → Secrets and variables → Actions → New secret, para cada:
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`, `GLM_KEY`, `GEMINI_KEY`, `DEEPSEEK_KEY`,
   `TELEGRAM_TOKEN`, `TELEGRAM_CHAT`.
   > A `service_role` vive **só aqui** (servidor). No cockpit vai só a **anon key**.

**4. Ligar o cockpit ao corpo.** Abra o link → menu ⚙ → 🌙 Corpo 24/7 → cole Supabase URL + anon key.

**5. Testar.** Actions → ZANKA Worker 24/7 → Run workflow. Deve rodar e (se houver tarefa) pingar seu Telegram.

## Regras de ouro
- Chaves de LLM: no cockpit ficam no **navegador** (localStorage); no worker ficam nos **Secrets**. Nunca no código.
- `service_role` nunca sai do worker.
- Actions roda **fora da China** → chama os LLMs sem depender do seu VPN.
- O cron do Actions pode atrasar alguns minutos — ótimo para lote noturno, não para tempo real.
