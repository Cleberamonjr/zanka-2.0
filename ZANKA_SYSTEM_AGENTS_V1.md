# 🤖 ZANKA SYSTEM v1 — 7 AGENTES WORLD-CLASS

## Cada agente é um ESPECIALISTA de mundo real trabalhando 24/7

---

# 🎨 AGENT 1: IRIS — Content Creator (Instagram Luxi)

## Role: Chief Content Officer
**Responsabilidade:** Criar conteúdo que VIRA em Instagram Luxi (revendedoras de joias)  
**Métrica de Sucesso:** Engagement >4%, CTR >2%, viral rate >10%/semana  

---

## SISTEMA DE IRIS

### Context (Você preenche uma vez):
```
BRAND VOICE:
- Público: Mulheres 25-50 que revendem joias/acessórios
- Tom: Inspirador, prático, viralizable (não corporativo)
- Objetivo: Vender Luxi (app de gestão) via proof of concept (antes/depois)

TARGET INSIGHTS:
- Problema: "Tenho 200+ joias, não consigo organizar"
- Solução: "Luxi organiza tudo em 2 min, exponha seu catálogo, faça mais vendas"
- Viraliza quando: Transformation story (caos → ordem visível)

TRENDS BRASILEIROS:
- Formato: Reels, Stories, Carousels (9:16 vertical)
- Hashtags hot: #semijoias #revendedorajoia #empreendedora #ecommerce
- Timing: 6-8 AM (café), 12-1 PM (almoço), 6-8 PM (pós-trabalho)
```

### Daily Operation (Autônomo):

#### 1. INPUT: Gera ideias diárias
```
IRIS executa às 00:00 UTC (21:00 Dongguan - noite):

"Com base no que viralizou ontem, quais são as 5 ideias de conteúdo 
para hoje que vão:
- Ressoar com revendedoras de joias
- Mostrar antes/depois (caos → organizado)
- Incluir CTA para tentar Luxi
- Usar trending sounds/hashtags

Formato: JSON com 5 ideias + copy resumido + hashtags + horário publicação"

OUTPUT:
{
  "ideas": [
    {
      "id": 1,
      "title": "Antes/Depois: Gaveta Caótica",
      "format": "Reel 15s",
      "copy": "Tinha 150 pulseiras perdidas... agora (LUXI) tenho tudo categorizado, foto de cada uma, e vendo 3x mais. Saiba como: [link trial]",
      "hashtags": "#semijoias #revendedora #antes #depois #organizacao",
      "sound_suggestion": "trending audio [2 opções]",
      "publish_time": "07:00 Brasil" (12:00 UTC)
    },
    {...},
    ...
  ]
}
```

#### 2. APPROVAL: Você escolhe 2-3 ideias (ou deixa IRIS decidir)
```
Se IRIS não recebe feedback em 4 horas:
→ Publica automaticamente as 2 melhores (maior potencial viral)
```

#### 3. CREATION & PUBLISH: IRIS cria o conteúdo
```
IRIS gera:
- Copywriting final (português natural, com CTA)
- Hashtag strategy (mix virais + niche)
- Scheduled posting (timing otimizado Brasil)

INTEGRAÇÃO:
- Zapier: Conecta com Instagram Luxi API
- Auto-publish em horário otimizado
- Rastreia engagement em tempo real
```

#### 4. FEEDBACK LOOP: Aprende com dados
```
IRIS monitora após publicação:
- Primeiras 30 min: Engagement rate
- 2 horas: Save rate, share rate
- 24 horas: Reach, CTR (clicks para Luxi)

Registra em Google Sheets:
- Que tipo de copy converte
- Que horários pegam melhor
- Que trending sounds viralizam
```

---

## GUARDRAILS DE IRIS

✅ PODE:
- Postar até 3 posts/dia (se conversão mantiver >2%)
- A/B testar copys/ângulos
- Usar trending sounds/hashtags
- Mudar horários de publicação
- Pausar posts underperforming

❌ NÃO PODE:
- Prometer desconto de Luxi sem seu OK
- Postar conteúdo off-brand
- Usar imagens/vídeos que você não aprovou
- Aumentar frequência se conversão cair >20%

---

---

# 💬 AGENT 2: LUCAS — Lead Capture & Qualification (Instagram DMs)

## Role: Chief Sales Development Officer
**Responsabilidade:** Converter Instagram DMs → Leads qualificados 24/7  
**Métrica de Sucesso:** 12+ DMs/dia, 70%+ response rate, 30%+ qualified  

---

## SISTEMA DE LUCAS

### Context (Você preenche uma vez):
```
LEAD QUALIFICATION FRAMEWORK:
- HOT: "Quero testar Luxi hoje" ou "Tenho 500+ joias"
- WARM: "Tenho interesse em app de gestão" 
- COLD: "Quem é vocês?" ou "Como funciona?"

QUALIFICATION CRITERIA:
- Nome + WhatsApp = mínimo (auto-collect)
- Tipo de negócio (revendedora? Loja própria? Hobby?)
- Volume de joias
- Urgência (vende há quanto tempo?)

INTENT SIGNALS:
- 🔴 RED: "Só olhando", "Pode deixar meu email"
- 🟡 YELLOW: "Interessada mas vou pensar"
- 🟢 GREEN: "Quanto custa?", "Como começo?"
```

### Daily Operation (Autônomo 24/7):

#### 1. MONITORAR DMs
```
LUCAS roda continuamente:
- Check Instagram DMs a cada 10 min
- Detector de keywords (trial, preço, como funciona, oi, olá)
- Se novo DM → responde em <2 min
```

#### 2. AUTO-RESPOND (Templates Otimizados)
```
Se pessoa escreve: "Olá, quem são vocês?"
→ LUCAS responde AUTOMATICAMENTE:

"Oi [Nome]! 👋 
Somos a Luxi - app que organiza sua coleção de joias + 
exponha seu catálogo + venda direto!

Você revende joias ou tem loja? Quantas peças você tem? 
Responde que eu mando um demo rápido 👉"

[Se responde "sou revendedora com 200 joias"]
→ "Perfeito! Você é HOT lead 🔥 Seu WhatsApp é [coletado]? 
Vou enviar link de trial + te chamar pra demo em 2h"
```

#### 3. QUALIFY & SEGMENT
```
LUCAS classifica no Supabase (automático):

leads_qualified (table):
├─ id_lead (único)
├─ nome
├─ whatsapp
├─ tipo_negocio (revendedora/loja/hobby)
├─ volume_joias (estimado)
├─ temperature (HOT/WARM/COLD)
├─ source (instagram_dm)
├─ data_primeiro_contato
├─ ultima_resposta_iris
└─ status (novo/qualificado/convertido)
```

#### 4. PASSA PARA GAIA
```
Quando lead = QUALIFICADO:
- Envia webhook para Gaia: "Lead pronto para trial"
- Copia WhatsApp + contexto
- GAIA toma de lá
```

---

## GUARDRAILS DE LUCAS

✅ PODE:
- Responder todos os DMs 24/7
- Usar templates de resposta
- Qualificar leads
- Coletar: Nome, WhatsApp, tipo de negócio
- Agendar chamadas com você (na sua agenda)

❌ NÃO PODE:
- Prometer features que Luxi não tem
- Mentir sobre preço/trial
- Contatar antigos leads sem permissão
- Oferecer desconto sem seu OK

---

---

# 🎯 AGENT 3: GAIA — Trial Activation & Sales Funnel

## Role: Chief Revenue Officer
**Responsabilidade:** Lead qualificado → Trial ativo no Supabase + primeira compra  
**Métrica de Sucesso:** 40%+ leads convertendo pra trial, 25%+ trial→pago  

---

## SISTEMA DE GAIA

### Context (Você preenche uma vez):
```
TRIAL ACTIVATION FLOW:
1. Lead recebe link Luxi (https://comluxijewelry.pages.dev)
2. Lead faz signup + cria 1 loja
3. GAIA acompanha: signup → login → primeira ação
4. Se ativo: "venda soft" na semana 3 (antes de expirar 30d trial)
5. Se inativo: "re-engajamento" no dia 7

TRIAL TIMELINE:
- Dia 0: Lead recebe link + primeira mensagem WhatsApp
- Dia 1: GAIA checks: fez signup?
- Dia 3: GAIA checks: fez login?
- Dia 7: GAIA checks: adicionou joias?
- Dia 20: GAIA: "Sua trial vence em 10 dias, vai pagar?"
- Dia 27: GAIA: Última chance (desconto 10% se pagar hoje)
- Dia 30: Trial expira, lead vira customer ou churns
```

### Daily Operation (Autônomo):

#### 1. ENVIA LINK & PRIMEIRA SEQUÊNCIA
```
GAIA recebe lead de LUCAS com WhatsApp:

Mensagem 1 (imediato):
"Oi [Nome]! 👋 Aqui é a Luxi!
Criei um acesso pra você testar GRÁTIS por 30 dias:
👉 [link trial Luxi]

É rápido: cria sua loja + adiciona 3 joias pra ver funcionar.
Depois te mando um vídeo demo de 2 min 🎥"

[Aguarda confirmação]

Mensagem 2 (2h depois se não clicou):
"Ainda não conseguiu clicar? Deixa eu mandar um vídeo curto 
mostrando como é fácil... (vídeo de 30s)"
```

#### 2. MONITORA ENGAGEMENT (Dashboard Supabase)
```
Webhook automático: quando alguém faz signup em Luxi
→ Escreve na tabela trial_activations

trial_activations (table):
├─ id_trial
├─ whatsapp_lead
├─ data_signup
├─ data_primeira_loja
├─ status_onboarding (0%/25%/50%/100%)
├─ num_joias_adicionadas
├─ num_logins_totais
├─ engagement_score (calculado)
├─ predicted_conversion (IA: sim/não)
└─ acao_recomendada

GAIA roda query diária:
- Quem deu signup mas não fez login? (re-engajar)
- Quem fez login mas 0 joias? (ajudar onboarding)
- Quem tá super engajado? (vender no dia 15)
```

#### 3. SEQUÊNCIAS AUTOMÁTICAS
```
GAIA dispara mensagens automáticas (WhatsApp via Zapier):

[Dia 1 - Ninguém clicou]
→ "Ops, o link não funcionou? Tenta de novo: [novo link]"

[Dia 3 - Fez signup, 0 lojas]
→ "Oi, você entrou mas ainda não criou sua 1ª loja.
   Quer que eu te guie em 2 minutos? Posso falar por vídeo"

[Dia 7 - 0 lojas adicionadas]
→ "[Vídeo de 2 min do você usando Luxi]
   Você viu? É assim de fácil! Que tal começar agora?"

[Dia 15 - Engajado (10+ lojas, 50+ joias)]
→ "Cara, você é incrível! Luxi tá funcionando perfeito pra você.
   Quer ativar agora? Só R$59,90/mês = 5 vendas a mais no 1º mês.
   Faço um 10% de desconto se pagar hoje: R$53,91"

[Dia 20 - Qualquer status]
→ "Sua trial vence em 10 dias! Quer continuar?"

[Dia 27 - Não converteu ainda]
→ "Última chance: 10% desconto se assinar hoje!
   Depois volta para R$59,90/mês. Vale a pena?"
```

#### 4. AGENDAMENTO DE CALLS (Com você)
```
Lead HOT (volume alto joias, engajado) → GAIA agenda demo:

"Ótimo! Vou marcar uma call rápida com meu boss (Clebe) 
pra você ver ao vivo como lucra com Luxi. Quais horários?
[links Calendly seu]"

Integração:
- Zapier lê sua agenda (Google Calendar)
- Mostra apenas horários disponíveis
- Confirma call + manda link Zoom automaticamente
- Reminder 30 min antes
```

---

## GUARDRAILS DE GAIA

✅ PODE:
- Enviar sequências automáticas WhatsApp
- Agendar calls na sua agenda
- Oferecer trial 30 dias (sem custo)
- Oferecer 10% desconto como incentivo
- Monitorar engagement leads

❌ NÃO PODE:
- Oferecer desconto >15% sem OK
- Prometer features que Luxi não tem
- Contatar alguém que pediu pra parar
- Garantir resultado (X vendas, etc)

---

---

# 🔍 AGENT 4: SCOUT — Produto Intelligence (Shopee)

## Role: Chief Product Officer (Shopee)
**Responsabilidade:** Encontrar produtos Shopee que EXPLODEM em vendas  
**Métrica de Sucesso:** 20+ produtos scored/dia, recomendações com >70% acurácia  

---

## SISTEMA DE SCOUT

### Context (Você preenche uma vez):
```
SHOPEE CATEGORIES DE FOCO:
- Semijoias (pulseiras, colares, anéis)
- Acessórios (bolsas, óculos, maquiagem)
- Moda (camisetas, vestidos trending)

SCORING ALGORITHM:
Points = (Views × 0.1) + (Orders × 1) + (Rating × 2) 
         - (Competitors × 0.5) + (Trend_Score × 5)

HOT SCORE: >500 pontos (vale produzir vídeo)
WARM: 300-500 (monitor)
COLD: <300 (skip)
```

### Daily Operation (Autônomo):

#### 1. MONITORA TRENDING PRODUCTS
```
SCOUT roda diariamente (07:00 UTC = 03:00 Dongguan):

Acessa Shopee API:
- Top 100 products semijoias (24h)
- Top 100 products acessórios (24h)
- Filtra por views, conversão, rating

Coleta dados:
├─ product_id
├─ nome
├─ views_24h
├─ orders_24h
├─ price (BRL)
├─ rating
├─ seller_reputation
├─ affiliate_link (seu)
├─ images_count
└─ description

Exemplo:
"Pulseira Dourada Aço Inoxidável"
- Views: 5,200
- Orders: 120
- Rating: 4.8/5.0
- Price: R$12,90
- Affiliate commission: 5% = R$0,65/venda
```

#### 2. SCORING & RANKING
```
SCOUT calcula HOTNESS SCORE:

Pulseira Dourada:
- Views 5,200 × 0.1 = 520
- Orders 120 × 1 = 120
- Rating 4.8 × 2 = 9.6
- Competitors (similar) 15 × 0.5 = -7.5
- Trend_Score (crescimento 48h) = +80 (trending!)

TOTAL SCORE = 722 🔥 (HOT! VIRA CONTEÚDO)
```

#### 3. SALVA EM GOOGLE SHEETS
```
Atualiza planilha: "Shopee Radar Diário"

| Product | Category | Views | Orders | Score | Affiliate Link | Status | Video Ready |
|---------|----------|-------|--------|-------|----------------|--------|-------------|
| Pulseira Dourada | Acessórios | 5200 | 120 | 722 | [link] | HOT | Aguardando PULSE |
| Colar Minimalista | Semijoias | 3100 | 45 | 580 | [link] | HOT | Pode começar |
| Vestido Social | Moda | 8000 | 200 | 750 | [link] | 🔥 VIRAL | PULSE já tá nos 300 cliques! |

→ PULSE puxa dessa planilha os produtos HOT
→ Cria vídeos (9:16) dos top 3
→ Publica + testa CTA
```

#### 4. RECOMENDAÇÕES PARA VOCÊ
```
Daily report (Slack às 08:00 Dongguan):

"🔍 SCOUT REPORT - Shopee Trending
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hoje encontrei 3 PRODUTOS DE OURO 🏆

1. Pulseira Dourada Aço (Score: 722) 
   → 5,200 views, 120 pedidos em 24h
   → Margem: 5% = R$0,65 por venda
   → Status: Pronto para vídeo
   → Action: PULSE tá fazendo vídeo agora

2. Colar Minimalista Prata (Score: 680)
   → Trending up 45% (últimas 48h!)
   → 3,100 views, excelente rating
   → Action: Recomendo prioritário amanhã

3. [...]

⏭️ PRÓXIMOS: Monitore esses 5 produtos (WARM)
[tabela com trending secundários]
"
```

---

## GUARDRAILS DE SCOUT

✅ PODE:
- Monitorar Shopee 24/7
- Calcular scoring automático
- Recomendar produtos
- Atualizar Google Sheets
- Identifica gaps de mercado

❌ NÃO PODE:
- Falsificar dados de produto
- Violar termos Shopee
- Baixar dados protegidos

---

---

# 📊 AGENT 5: PULSE — Distribution & Optimization (Shopee + Instagram)

## Role: Chief Marketing Officer
**Responsabilidade:** Publicar conteúdo + otimizar performance + testa CTAs  
**Métrica de Sucesso:** 100+ cliques/dia links Shopee, ROI >3x  

---

## SISTEMA DE PULSE

### Context (Você preenche uma vez):
```
SHOPEE AFFILIATE LINK:
[Seu link único de afiliado Shopee - para rastreamento]

CTA VARIATIONS (A/B Test):
- CTA A: "Clica no link e vê como organizar melhor"
- CTA B: "Quanto: R$12,90 (link na bio)"
- CTA C: "Pegue a sua + compartilhe com uma amiga"
- CTA D: "3,200 pessoas já compraram essa! Você?"
```

### Daily Operation (Autônomo):

#### 1. RECEBE CONTEÚDO PRONTO
```
Workflow:
1. SCOUT identifica produto HOT
2. PULSE aguarda vídeo 9:16 pronto (de você ou IA generator)
3. PULSE: "Vídeo disponível? Publicar?"

[Se sim]
→ Publica em: Instagram Stories Luxi + Feed + Reels
→ Adiciona CTA + hashtags
→ Monitora performance
```

#### 2. PUBLICA INTELIGENTEMENTE
```
Cada publicação tem:
├─ Vídeo 9:16 (produto Shopee)
├─ Copy curto + urgência ("últimas 3 em estoque!")
├─ CTA A/B testado ("link bio" vs "clique aqui")
├─ Hashtags relevantes (#semijoias #acessórios #shopee)
├─ Timing otimizado (18:00-20:00 Brasil)
└─ Tracking: utm_source=instagram, utm_medium=stories

Exemplo:
Video: [Pulseira dourada brilhando nos dedos]
Copy: "Pulseira que toda mulher quer 💛 
Vem aí na Shopee + de 5k vendidas 😍
[link]"
Hash: #semijoias #pulseira #ouro #acessórios #viral
```

#### 3. MONITORA PERFORMANCE (Real-time)
```
PULSE rastreia após publicação:

0-30 min: Primeiros cliques
- Instagram impressions
- CTR (clique-rate)
- Link clicks (via UTM)

2-6 horas: Performance médio prazo
- Engagement (saves, shares)
- Conversão esperada

24h: ROI Final
- Total cliques link Shopee
- Estimated conversão (clique × 2%)
- Comissão estimada

Exemplo de tracking:
"Pulseira Dourada Story"
├─ Impressões: 2,400
├─ Cliques: 156 (6.5% CTR ✅)
├─ Cliques no link: 98 (sim, ~63% clicaram 2x)
├─ Comissão estimada: 98 × 5% × R$12,90 = R$63,27
└─ ROI: +300% (se você gastou R$20 em boost)
```

#### 4. A/B TESTA CTAs
```
PULSE roda testes contínuos:

Segunda: CTA A ("link bio") - 150 cliques
Terça: CTA B ("quanto: R$12,90") - 102 cliques
Quarta: CTA C ("compartilhe com amiga") - 198 cliques ✅ WINNER

→ PULSE detecta: CTA C vira + 80 cliques
→ Publica mais com CTA C
→ Registra learning: "Social proof + urgência = +48% CTR"
```

#### 5. OTIMIZA CONTINUAMENTE
```
PULSE executa diariamente:

- Pausa posts com <3% CTR (underperformers)
- Booosta posts com >6% CTR (50 cliques)
- Testa novos horários se CTR cair
- Identifica trending sounds que funcionam
- Replica winners

Weekly análise:
- Qual tipo de produto converte mais?
- Qual CTA tem melhor CTR?
- Melhor horário de publicação?
→ Recomenda estratégia pro mês que vem
```

---

## GUARDRAILS DE PULSE

✅ PODE:
- Publicar conteúdo pronto
- A/B testar CTAs
- Pausar underperformers
- Boost posts com alto engagamento
- Testar novos horários

❌ NÃO PODE:
- Publicar vídeos que você não aprovou
- Clicar seus próprios links (fraud)
- Prometer resultado específico
- Violar termos Instagram/Shopee

---

---

# 📈 AGENT 6: ZENA — Daily Analytics & Insights

## Role: Chief Data Officer
**Responsabilidade:** Medir tudo, ver o que funciona, recomendar ações  
**Métrica de Sucesso:** 100% acurácia dados, insights usáveis, forecast >75%  

---

## SISTEMA DE ZENA

### Context (Você preenche uma vez):
```
DATA SOURCES:
- Instagram: Meta API (reaches, engagement, CTR, followers)
- WhatsApp: Logs das mensagens (responses, convs)
- Supabase: leads_qualified, trial_activations, conversions
- Shopee: Affiliate dashboard (cliques, comissão)
- Google Sheets: SCOUT radar, performance log
```

### Daily Operation (Autônomo):

#### 1. CONSOLIDA DADOS
```
ZENA roda à 08:00 UTC (04:00 Dongguan você dorme):

Query 1 - INSTAGRAM STATS (últimas 24h):
SELECT
  total_posts,
  total_reach,
  total_engagement,
  avg_engagement_rate,
  top_post,
  follower_change
FROM instagram_metrics
WHERE date = TODAY

Query 2 - LEAD FUNNEL:
SELECT
  total_dms,
  responded_dms,
  response_rate,
  hot_leads,
  warm_leads,
  cold_leads,
  leads_qualified
FROM leads_qualified
WHERE created_at > 24h_ago

Query 3 - TRIAL ACTIVATION:
SELECT
  total_trials_activated,
  total_signups,
  activation_rate,
  engaged_users (login + add 1 joia),
  predicted_conversions,
  churn_risk
FROM trial_activations
WHERE created_at > 24h_ago

Query 4 - SHOPEE PERFORMANCE:
SELECT
  total_cliques,
  click_source (stories/reels/feed),
  estimated_conversions,
  estimated_comissao,
  top_produto,
  roi
FROM shopee_affiliate_tracking
WHERE date = TODAY

Query 5 - TRENDING ANALYSIS:
SELECT
  best_performing_copy,
  best_performing_time,
  best_performing_cta,
  trending_products,
  emerging_patterns
FROM daily_logs
WHERE date = TODAY
```

#### 2. GERA REPORT AUTOMÁTICO
```
📊 ZANKA DAILY REPORT — Oct 4, 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ LUXI ACQUISITION FUNNEL
├─ Instagram reach: 2,340 pessoas
├─ DMs recebidos: 12
├─ Response rate: 100% ✅
├─ Leads qualificados: 8 (66% da meta)
├─ Trials ativados: 3 (37% de conversão DM→Trial) 🟢
├─ Engagement score: 7.2/10 (melhorando!)
└─ Custo/lead: $1.87 (target: <$5) 🎯

✅ SHOPEE AFFILIATE
├─ Cliques gerados: 156
├─ Estimated conversão (2%): 3 compras
├─ Comissão estimada: R$63,27
├─ ROI: 4.2x (se gastou R$15 em boost)
├─ Top produto: Pulseira Dourada (98 cliques)
└─ Trending: Colares minimalistas (+45% trending)

✅ WHAT WORKED TODAY
├─ CTA "Antes/Depois": 6.8% CTR ✅
├─ Hora 19:00-20:00: +23% engagement
├─ Vídeos 15s: 4x melhor que fotos
├─ Hashtag #revendedora: 340 impressões

⚠️ ALERTS
├─ Resposta média DMs: 2 min (bom!)
├─ Taxa qualificação: 66% (pedir >80%)
├─ 1 lead CHO no status predito (vai fazer trial)

💡 RECOMENDAÇÕES
├─ → Aumentar frequência posts "Antes/Depois" para 5/semana
├─ → Testar anúncio boost (R$20) no melhor horário (19:00)
├─ → Copiar "Antes/Depois" pra Shopee (2 vídeos novos)
└─ → Acompanhar lead HOT (vai fazer trial hoje)

🎯 PROJEÇÃO 30 DIAS
├─ Leads estimate: 240/mês (atual: 8/dia × 30)
├─ Trials estimate: 90 (current 25% conv)
├─ Conversão pago: ~20 clientes (22% conversion)
├─ Revenue estimate: R$1,180 (20 × R$59)
└─ META: 5000 leads → 250 trials → 50 pagos (R$2,950)
     DESVIO: -2,010 leads/mês, Need 3.8x escala

🚀 NEXT MOVE
"ZANKA acha que precisa: 
1. Aumentar freq conteúdo (2→4 posts/dia)
2. Testar anúncios (budget: $100/semana)
3. Copiar Shopee content → replicar pra Stories Luxi
4. Identificar micro-influencers (5k-20k followers) pra divulgar"

Você aprova? (Y/N/Discutir)
```

#### 3. DETECTA PADRÕES
```
Análises avançadas (ZENA executa):

COHORT ANALYSIS:
- Leads vindos de "Antes/Depois" → 25% trial, 5% pago
- Leads DMs genéricos → 10% trial, 0% pago
→ Insight: "Antes/Depois" é 2.5x mais eficiente

CHURN PREDICTION:
- Trial com <3 lojas criadas → 80% churn
- Trial com >5 lojas → 40% churn, 20% conversão
→ Ação: GAIA foca em "5 lojas target" no onboarding

BEST TIME ANALYSIS:
- 19:00: 7.2% engagement
- 20:00: 6.8% engagement
- 21:00: 3.1% engagement
→ Action: Publicar sempre 19:00-20:00

CTA PERFORMANCE:
- "Link na bio": 3.2% CTR
- "Clique aqui": 5.1% CTR
- "Compartilhe": 6.8% CTR ✅
→ Action: Usar "Compartilhe" em 80% dos posts
```

---

## GUARDRAILS DE ZENA

✅ PODE:
- Acessar todos os dados
- Gerar reports automáticos
- Detectar padrões
- Fazer projeções
- Recomendar ações

❌ NÃO PODE:
- Vazar dados (confidencialidade)
- Falsificar métricas
- Fazer claims sem evidência

---

---

# 🎬 AGENT 7: (VOCÊ ESCOLHE PRÓXIMO)

**Opções:**
1. **VITOR** - Influencer Outreach (achar micro-influencers 5k-20k followers)
2. **MARCO** - Email Marketing (sequências nurture após trial)
3. **ALEX** - Video Production (gera roteiros, briefing pra produção)
4. **GABRIEL** - Budget Optimization (distribui spend entre canais)
5. **Outro:** _________

---

---

## 🔗 INTEGRAÇÃO TÉCNICA (ZANKA System Rodando)

```
Todos os 7 agentes conectados:

IRIS (Content)
  ↓ Publica → Instagram

LUCAS (Lead Capture) 
  ↓ DM recebido → Qualifica → Supabase

GAIA (Trial Activation)
  ↓ Lead qualificado → WhatsApp → Supabase

SCOUT (Produto Research)
  ↓ Trending products → Google Sheets

PULSE (Distribution)
  ↓ Produto hot → Shopee link → Instagram

ZENA (Analytics)
  ↓ Consolida TUDO → Slack report 08:00

ZANKA (CEO)
  ↓ Lê report Slack → Toma decisão → Action
```

**Fluxo de dados:**
```
Instagram API → Zapier → Supabase ← Google Sheets
   ↑                           ↓
   └─────← Slack ← ZENA ←─────┘
                ↓
             Você (lê 5 min/dia)
```

---

## 🚀 IMPLEMENTAÇÃO (Próximas 48h)

### HOJE:
- [ ] Você confirma 7 agentes acima (nomes, responsabilidades)
- [ ] Confirma qual é Agent 7 (de 5 opções ou próprio)
- [ ] Confirma Instagram Luxi handle
- [ ] Confirma seu WhatsApp + código país

### AMANHÃ:
- [ ] Claude cria Zapier workflows (integração n8n)
- [ ] Setup Google Sheets (Shopee Radar)
- [ ] Configurar Supabase tables (leads, trials, conversions)
- [ ] Testar 1ª publicação manual (IRIS)

### DIA 3+:
- [ ] ZANKA começa a operar 24/7
- [ ] Você recebe daily report às 08:00 UTC
- [ ] Monitorar + ajustar

---

## 📋 CHECKLISTS POR AGENTE

### IRIS Checklist:
- [ ] Copywriting templates pronto (português natural)
- [ ] Trending sounds/hashtags database
- [ ] Scheduling Instagram API
- [ ] Performance tracking

### LUCAS Checklist:
- [ ] DM monitoring (10 min interval)
- [ ] Auto-response templates
- [ ] Lead qualification rules
- [ ] Supabase table: leads_qualified

### GAIA Checklist:
- [ ] WhatsApp Business API (Zapier)
- [ ] Sequências automáticas (6 templates)
- [ ] Trial link gerador
- [ ] Calendly integration (seu agendamento)

### SCOUT Checklist:
- [ ] Shopee API access (affiliate account)
- [ ] Scoring algorithm coded
- [ ] Google Sheets automation
- [ ] Daily cron job (07:00 UTC)

### PULSE Checklist:
- [ ] Instagram publishing API (Zapier)
- [ ] CTA variations A/B tested
- [ ] UTM tracking setup
- [ ] Performance monitoring dashboard

### ZENA Checklist:
- [ ] Supabase queries (todas 6)
- [ ] Slack integration (webhook)
- [ ] Report template 
- [ ] Daily cron job (08:00 UTC)

### ZANKA (CEO) Checklist:
- [ ] Decision framework (quando escalar, pausar, etc)
- [ ] Budget guardrails definidos
- [ ] Recommendation engine (baseado em ZENA data)

---

## 💾 SAVED TO: `/home/claude/ZANKA_SYSTEM_AGENTS_V1.md`
