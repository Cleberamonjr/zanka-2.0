# 🌙 ZANKA — Guia de conexão do corpo 24/7

Eu deixei tudo pronto. Aqui está **só o que depende das suas contas** — o que eu não posso (nem devo) fazer por você. São ~15 minutos.

Arquivos do pacote:
- `zanka_corpo_supabase.sql` — a espinha (fila de tarefas)
- `zanka_runner_n8n.json` — o cérebro (roda dormindo)
- `index.html` — o cockpit, já com a ponte "Corpo 24/7"

---

## Passo 1 — Supabase: criar as tabelas (2 min)
1. Abra seu projeto no Supabase (ex.: `meidu-leads`) → menu **SQL Editor** → **New query**.
2. Cole todo o conteúdo de `zanka_corpo_supabase.sql` e clique **Run**.
3. Confirme em **Table Editor** que apareceram: `tarefas`, `eventos`, `briefings`.

## Passo 2 — Pegar as chaves do Supabase (1 min)
Em **Settings → API**, copie:
- **Project URL** (ex.: `https://xxxx.supabase.co`)
- **anon public** → vai no cockpit (navegador)
- **service_role** → vai **só no n8n** (nunca no HTML)

## Passo 3 — n8n: importar o runner (3 min)
1. No seu n8n (`cleberamonjr.app.n8n.cloud`) → **Workflows → Import from File** → selecione `zanka_runner_n8n.json`.
2. Abra o nó **ZANKA Runner** e preencha, no topo do código, só as constantes:
   - `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE`
   - `LLM_KEY` (GLM já vem como padrão; troque se quiser outro)
   - `TELEGRAM_TOKEN` (bot @MeiduLead) — o `TELEGRAM_CHAT` já está `8804474814`
3. **Save** e ligue o botão **Active** (canto superior). Pronto: ele roda sozinho a cada 10 min.

> Se seu n8n reclamar da versão do nó "Schedule", apague-o e recrie um **Schedule Trigger** de 10 min ligado ao **ZANKA Runner**. O que importa está no Code node.

## Passo 4 — Conectar o Google (o clique de OAuth, sem senha) (2 min)
Só quando você for usar Gmail/Sheets/Drive/Calendar nos fluxos:
1. No n8n, ao adicionar um nó **Gmail / Google Sheets / etc.**, clique em **Create New Credential**.
2. Escolha **OAuth2** → **Sign in with Google** → autorize na tela **do próprio Google**.
3. O n8n guarda um token revogável. **Sua senha nunca é vista por ninguém.** Você revoga quando quiser em: myaccount.google.com → Segurança → Acesso de terceiros.

## Passo 5 — Ligar o cockpit ao corpo (2 min)
1. Abra o `index.html` → menu **⚙ → 🌙 Corpo 24/7**.
2. Cole a **URL do Supabase** e a **anon key** → **Salvar conexão**.
3. (Opcional) cole uma **URL de webhook do n8n** se quiser um botão "rodar agora".

---

## Como usar (o ciclo)
- No painel **🌙 Corpo 24/7**, escolha o **agente**, escreva a **ação** (ex.: `briefing`) e o **payload**, defina o **horário** (ex.: 6h) e **Enfileirar**.
- Você fecha o navegador e dorme. O **runner do n8n** pega a tarefa no horário, "vira" o agente via IA, executa e grava o resultado.
- Tarefas marcadas **"exige aprovação"** (ex.: outreach, gasto de verba) ficam paradas em 🟡 até você tocar **Aprovar** — nada externo dispara sem você.
- De manhã: **Ver status** mostra o que rolou, e o Telegram já te avisou.

## Fronteira honesta (o que ainda precisa de mais)
- **Enviar e-mail/WhatsApp de verdade sozinho:** exige o nó Gmail (via OAuth do Passo 4) ou API do WhatsApp aprovada. O encanamento já está pronto; falta você conectar a conta.
- **Imagem overnight:** adicione um nó no runner que chame a API de imagem e salve no Supabase Storage — me peça quando quiser esse braço.
- **Venda 100% autônoma:** é o último passo, com portão de aprovação — e cuidado com seu visto/compliance. Comece com o agente *preparando* e você *aprovando*.

## Regra de ouro
A `service_role` mora **só no n8n**. No navegador vai **só a anon key**. Senha nenhuma, em lugar nenhum.
