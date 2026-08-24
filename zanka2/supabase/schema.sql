-- ============================================================
-- ZANKA OS — FUNDAÇÃO DO "CORPO" (execução 24/7)
-- Fila de tarefas + log de eventos + briefings da DIANA
-- ------------------------------------------------------------
-- Onde rodar: Supabase → SQL Editor → New query → Run
-- Projeto sugerido: meidu-leads (ou um novo "zanka-os")
--
-- SEGURANÇA / CHAVES:
--   • n8n (servidor, roda dormindo) usa a chave SERVICE_ROLE  -> ignora RLS
--   • ZANKA (navegador/cockpit)     usa a chave ANON          -> respeita RLS
--   NUNCA coloque a service_role no HTML. Ela vive só dentro do n8n.
-- ============================================================

create extension if not exists pgcrypto;

-- Status possíveis de uma tarefa ------------------------------
do $$ begin
  create type tarefa_status as enum
    ('pendente','executando','aguardando_aprovacao','feito','erro','cancelada');
exception when duplicate_object then null; end $$;

-- 1) FILA DE TAREFAS — o coração do corpo ---------------------
create table if not exists tarefas (
  id               uuid primary key default gen_random_uuid(),
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now(),
  agente           text not null,                 -- 'diana','sabrina','galdino','hector'...
  acao             text not null,                 -- 'briefing','gerar_conteudo','rascunho_outreach'...
  payload          jsonb not null default '{}'::jsonb,
  prioridade       int  not null default 3,       -- 1 = alta ... 5 = baixa
  agendado_para    timestamptz,                   -- null = assim que possível
  status           tarefa_status not null default 'pendente',
  requer_aprovacao boolean not null default false,-- true = espera seu "ok" antes de agir externamente
  aprovado_por     text,
  resultado        jsonb,
  erro             text
);
create index if not exists idx_tarefas_fila   on tarefas (status, agendado_para, prioridade);
create index if not exists idx_tarefas_agente on tarefas (agente, status);

-- 2) LOG DE EVENTOS — o que rolou enquanto você dormia --------
create table if not exists eventos (
  id         uuid primary key default gen_random_uuid(),
  criado_em  timestamptz not null default now(),
  agente     text,
  tipo       text not null,                        -- 'acao','erro','info'
  mensagem   text not null,
  tarefa_id  uuid references tarefas(id) on delete set null,
  meta       jsonb
);
create index if not exists idx_eventos_data on eventos (criado_em desc);

-- 3) BRIEFINGS — saída da DIANA p/ o resumo matinal -----------
create table if not exists briefings (
  id         uuid primary key default gen_random_uuid(),
  criado_em  timestamptz not null default now(),
  data       date not null default current_date,
  resumo     text not null,
  metricas   jsonb
);
create index if not exists idx_briefings_data on briefings (data desc);

-- Trigger: mantém atualizado_em em dia -----------------------
create or replace function set_atualizado_em() returns trigger as $$
begin new.atualizado_em = now(); return new; end;
$$ language plpgsql;

drop trigger if exists trg_tarefas_upd on tarefas;
create trigger trg_tarefas_upd before update on tarefas
  for each row execute function set_atualizado_em();

-- ============================================================
-- RLS (Row Level Security)
-- Tool pessoal de 1 usuário: o cockpit (anon) pode ler e enfileirar.
-- O n8n usa service_role e ignora estas políticas.
-- ⚠️ Quando adicionar login por usuário, troque 'true' por auth.uid().
-- ============================================================
alter table tarefas   enable row level security;
alter table eventos   enable row level security;
alter table briefings enable row level security;

drop policy if exists anon_tarefas_all    on tarefas;
create policy anon_tarefas_all    on tarefas   for all    to anon using (true) with check (true);

drop policy if exists anon_eventos_read   on eventos;
create policy anon_eventos_read   on eventos   for select to anon using (true);

drop policy if exists anon_briefings_read on briefings;
create policy anon_briefings_read on briefings for select to anon using (true);

-- ============================================================
-- TESTE RÁPIDO (opcional) — enfileira uma tarefa de exemplo
-- insert into tarefas (agente, acao, payload, agendado_para)
-- values ('diana','briefing','{"periodo":"ontem"}'::jsonb, now());
-- select * from tarefas order by criado_em desc;
-- ============================================================

-- ============================================================
-- ZANKA 2.0 — MEMÓRIA (continuidade entre sessões e o worker noturno)
-- ============================================================
create table if not exists memoria (
  id         uuid primary key default gen_random_uuid(),
  criado_em  timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  agente     text not null,                 -- de quem é a memória ('zanka','diana'... ou 'time')
  projeto    text default 'geral',          -- escopo por projeto (Meidu Solar, Aurora, etc.)
  chave      text not null,                 -- ex: 'aprendizado','preferencia','contexto_cliente'
  valor      text not null,
  unique (agente, projeto, chave)
);
create index if not exists idx_memoria_busca on memoria (agente, projeto);

create table if not exists projetos (
  id         uuid primary key default gen_random_uuid(),
  criado_em  timestamptz not null default now(),
  nome       text not null unique,
  contexto   text,                          -- briefing do projeto que os agentes leem
  ativo      boolean not null default true
);

drop trigger if exists trg_memoria_upd on memoria;
create trigger trg_memoria_upd before update on memoria
  for each row execute function set_atualizado_em();

alter table memoria enable row level security;
alter table projetos enable row level security;
drop policy if exists anon_memoria_all on memoria;
create policy anon_memoria_all on memoria for all to anon using (true) with check (true);
drop policy if exists anon_projetos_all on projetos;
create policy anon_projetos_all on projetos for all to anon using (true) with check (true);
