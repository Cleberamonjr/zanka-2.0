# 🤖 ZANKA 2.0 — 17 AGENTES OPERACIONAIS REAIS

**Fonte:** `agents.json` - Configuração atual GitHub

---

## 📋 OS 17 AGENTES MAPEADOS

### Tier 1: ORQUESTRAÇÃO & DECISÃO (3)

| Agente | Especialidade | IA Atual | IA Recomendada | Status |
|--------|---------------|----------|---|---------|
| **ZANKA** | CEO, estratégia, orquestração | DeepSeek | DeepSeek + JEV layer | 🔴 Precisa JEV |
| **DIANA** | CFO, BI, dados, dashboards | DeepSeek | DeepSeek | ✅ OK |
| **NEJI** | COO, QA, projetos | DeepSeek | DeepSeek + Claude review | 🟡 Melhorar |

---

### Tier 2: MARKETING & CONTEÚDO (5)

| Agente | Especialidade | IA Atual | IA Recomendada | Status |
|--------|---------------|----------|---|---------|
| **SABRINA** | Conteúdo viral, métricas sociais | Gemini | Gemini | ✅ OK |
| **FRED** | Copywriting, SEO | Gemini | Gemini | ✅ OK |
| **LUDMILO** | Design, UX, landing pages | Gemini | Gemini | ✅ OK |
| **NIX** | Growth, estratégia | DeepSeek | DeepSeek | ✅ OK |
| **MBAKU** | Tráfego pago (ads) | GLM | Claude (melhor otimização) | 🟡 Testar |

---

### Tier 3: SALES & PIPELINE (4)

| Agente | Especialidade | IA Atual | IA Recomendada | Status |
|--------|---------------|----------|---|---------|
| **GALDINO** | CRM, pipeline | GLM | GLM | ✅ OK |
| **LUNA** | SDR, qualificação leads | Gemini | Gemini | ✅ OK |
| **MARCUS** | Follow-up, fechamento | GLM | GLM | ✅ OK |
| **IRIS** | Onboarding, CS, retenção | GLM | GLM | ✅ OK |

---

### Tier 4: NEGÓCIOS & OPERAÇÕES (3)

| Agente | Especialidade | IA Atual | IA Recomendada | Status |
|--------|---------------|----------|---|---------|
| **JOÃO** | B2B, parcerias | GLM | Claude (contatos, negociação) | 🟡 Testar |
| **MIKIMBA** | Prospecção, novos mercados | GLM | GLM | ✅ OK |
| **HECTOR BONILHA** | Dev, automações, APIs | DeepSeek | **Claude Sonnet** | 🔴 PRIORIDADE |

---

### Tier 5: ENGAJAMENTO & COMUNIDADE (2)

| Agente | Especialidade | IA Atual | IA Recomendada | Status |
|--------|---------------|----------|---|---------|
| **ANINHA** | Email marketing, reativação | Gemini | Gemini | ✅ OK |
| **JONNY** | Comunidade, engajamento | Gemini | Gemini | ✅ OK |

---

## 🚀 ROADMAP DE ATIVAÇÃO

### FASE 1: Hoje - Setup JEV + Claude (2h)

```
1. [ ] Integrar JEV como Decision Layer no ZANKA
   └─ Responsável: Roteamento, priorização, seleção modelo
   
2. [ ] Migrar HECTOR para Claude Sonnet
   └─ Tarefas: APIs complexas, diagnóstico bugs, automações
   
3. [ ] Manter todos 17 agentes em DeepSeek/Gemini/GLM
   └─ Sem mudança de backend (só add Claude + JEV)
```

### FASE 2: Amanhã - Integração Operacional (4h)

```
1. [ ] Criar Zapier workflow para cada agente (17 workflows)
   └─ Input trigger → Agente executa → Output Supabase
   
2. [ ] Criar n8n webhook receptor (cleberamonjr.app.n8n.cloud)
   └─ Recebe dados dos agentes
   └─ Orquestra sequências
   
3. [ ] Setup Supabase tables por agente
   └─ task_queue, task_logs, agent_performance
   
4. [ ] Slack integração (reports por tier)
   └─ 08:00: Relatório ZANKA+DIANA+NEJI
   └─ 12:00: Alert se blocker crítico
```

### FASE 3: Dia 3+ - Operação 24/7

```
1. [ ] Cada agente roda autonomous dentro especialidade
2. [ ] ZANKA + JEV orquestram rotas automáticas
3. [ ] DIANA consolida dados → ZANKA decide
4. [ ] Você recebe report 5 min/dia
```

---

## 🔌 ARQUITETURA TÉCNICA (ZANKA 2.0)

```
┌─────────────────────────────────────────────────┐
│         17 AGENTES (Gemini/DeepSeek/GLM)        │
│  ZANKA | DIANA | NEJI | SABRINA | FRED | ...    │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   JEV (Decision)    │
        │  Roteamento inteligente
        │  ├─ Prioridade (urgência)
        │  ├─ Modelo adequado (qual IA?)
        │  ├─ Escalação (blocker?)
        │  └─ Fallback (se fail?)
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  HECTOR (Claude)    │
        │  Engenharia, APIs   │
        │  Automações complexas
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   n8n Cloud         │
        │   Workflows 24/7    │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   Supabase          │
        │   task_queue        │
        │   task_logs         │
        │   analytics         │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   Slack + Email     │
        │   Reports (você)    │
        └─────────────────────┘
```

---

## 📊 OPERAÇÃO DIÁRIA (Como 17 agentes trabalham JUNTOS)

### 00:00 - SABRINA + FRED (Noite, Brasil)
- SABRINA: gera ideias conteúdo viral (noche = ideate)
- FRED: escreve copys para os posts

### 06:00 - SABRINA + LUDMILO (Manhã, Brasil)
- SABRINA: aprova melhor copy
- LUDMILO: designs graphics (Instagram banner, thumbnail)

### 08:00 - ZANKA + DIANA (Você acorda)
- DIANA: consolida métricas da noite
- ZANKA: recebe daily standup + decide escalações

### 10:00 - LUNA + MARCUS (Prospecção & Venda)
- LUNA: qualifica leads novos (DM Instagram, email)
- MARCUS: follow-up de warm leads (conversão)

### 12:00 - GALDINO (CRM Update)
- GALDINO: atualiza pipeline (quem moveu de stage)
- IRIS: reativa clientes dormindo (email, SMS)

### 14:00 - HECTOR (Automações)
- HECTOR: corrige bugs encontrados
- HECTOR: otimiza APIs lentes
- HECTOR: integra novo dado source

### 16:00 - JOÃO + MIKIMBA (Negócios)
- JOÃO: explora parcerias B2B
- MIKIMBA: prospecta novo mercado (geo, vertical)

### 18:00 - MBAKU (Ads)
- MBAKU: otimiza campanhas (pause low ROAS, boost high)
- MBAKU: A/B testa creative novo

### 20:00 - JONNY + ANINHA (Engagement)
- JONNY: responde comunidade (Slack, Discord, comments)
- ANINHA: dispara email campaign (reativação, onboarding)

### 23:00 - NEJI (QA & Consolidação)
- NEJI: verifica qualidade trabalho dos 16 agentes
- NEJI: gera relatório problemas pro dia seguinte

### 04:00 (Você dorme) - DIANA (Data consolidation)
- DIANA: consolida TUDO em dashboard
- DIANA: calcula ROI, trends, forecasts
- DIANA: pronta p/ standup 08:00

---

## 🎯 IMPLEMENTAÇÃO: PRIMEIRA TAREFA

Vou criar **ZAPIER SKILL** para cada agente. Exemplo:

```
SKILL: SABRINA - Daily Content Ideas

TRIGGER: Daily 00:00 UTC (21:00 Dongguan)
INPUT: 
  - Trending topics last 24h (ZENA source)
  - Best performing posts last week
  - Audience insights (age, interests, behavior)

PROCESS:
  → Chama Gemini API com contexto
  → Gera 5 ideias de conteúdo viral
  → Classifica por potencial viral (1-10)

OUTPUT:
  → Google Sheets: ideas_backlog
  → Slack: Daily ideas message
  → Next: FRED picks top 3 para copywriting

SUCCESS METRIC:
  → 5 ideias/dia × 70% viralizam = 3.5 viral posts/semana
```

Vou criar esses 17 skills agora?

---

## ⏭️ PRÓXIMO PASSO

**5 CONFIRMAÇÕES ANTES DE EU CRIAR 17 ZAPIER SKILLS:**

1. Você tem o `agents.json` local? Qual é o path?
2. HECTOR pode ser migrado pra Claude Sonnet HOJE?
3. JEV está disponível como API ou precisa integração?
4. n8n cloud já está configurado (cleberamonjr.app.n8n.cloud)?
5. Quando ativa: HOJE (overnight), AMANHÃ ou próxima SEGUNDA?

Após confirmar → Crio 17 skills + 17 n8n workflows + setup Supabase.

