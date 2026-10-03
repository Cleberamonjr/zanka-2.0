# ZANKA 2.0 — 17 Zapier Skills (Ready to Deploy)

## Setup Inicial

1. **Conectar no Zapier:**
   - Supabase (task_queue, task_logs, agent_performance)
   - Google Sheets (metrics dashboard)
   - Slack (reports)
   - Email (alerts)
   - Stripe (payments webhook)

2. **Imports:**
   - Copiar cada Skill abaixo → Cole em "Create Skill" no Zapier
   - Ou clique: https://zapier.com/help/create/basics/create-and-use-zaps

---

## ⚙️ SKILL #1: ZANKA Orchestrator - Daily Standup

**Trigger:** Schedule (08:00 Asia/Shanghai daily)

```yaml
Name: ZANKA Orchestrator - Daily Standup
Trigger: Schedule (Every day at 08:00 Asia/Shanghai)
Actions:
  1. Lookup Spreadsheet: Fetch latest KPIs from Google Sheets
  2. Code by Zapier (JavaScript):
     - Input: KPIs data
     - Process: Analyze metrics, identify top/bottom performers
     - Output: Standup summary
  3. Send Message: Slack #zanka-reports with standup
  4. Record in Supabase: task_logs (task_type: "standup", status: "completed", timestamp)
  5. Webhook: POST to n8n or secondary system (if needed)
```

**Code:**
```javascript
// Standup analysis
const kpis = inputData.kpis;
const standupSummary = {
  timestamp: new Date().toISOString(),
  leadsToday: kpis.leads_today || 0,
  trialsToday: kpis.trials_today || 0,
  revenueToday: kpis.revenue_today || 0,
  topAgent: kpis.top_performer || "N/A",
  issues: kpis.critical_alerts || [],
  recommendation: kpis.leads_today >= 166 ? "📈 On track! Scale ads." : "⚠️ Below target. Check content."
};
return standupSummary;
```

---

## ⚙️ SKILL #2: DIANA Daily Analytics

**Trigger:** Schedule (07:00 Asia/Shanghai daily)

```yaml
Name: Intelligence Cluster - Daily Analytics
Trigger: Schedule (Every day at 07:00 Asia/Shanghai)
Actions:
  1. Get Spreadsheet Rows: Fetch all lead data from Google Sheets
  2. Code by Zapier:
     - Calculate daily metrics (CAC, LTV, conversion rate, ROI)
     - Segment leads by source
     - Forecast revenue
  3. Update Spreadsheet: DIANA Dashboard tab
  4. Send Slack: #zanka-reports with metrics summary
  5. Record Supabase: agent_performance (agent_id: "DIANA", metrics: {...})
```

**Metrics Calculated:**
- Leads/day, Leads/source
- CAC (cost per acquisition)
- LTV (lifetime value)
- Trial→Paid conversion rate
- Revenue forecast (monthly)
- ROI by channel

---

## ⚙️ SKILL #3: NEJI Daily QA Audit

**Trigger:** Schedule (23:00 daily)

```yaml
Name: Technical Cluster - QA Audit & Quality
Trigger: Schedule (Every day at 23:00)
Actions:
  1. Supabase Query: Get all agent logs from last 24h
  2. Code by Zapier:
     - Check agent success rates
     - Identify failures/errors
     - Performance anomalies
     - Generate issues list
  3. Create Spreadsheet Row: Issues log
  4. Send Slack: #zanka-reports with issues summary
  5. Threshold Alert: If >5 critical errors, notify #zanka-alerts
```

---

## ⚙️ SKILL #4: SABRINA Content Ideation (00:00)

**Trigger:** Schedule (00:00 daily)

```yaml
Name: Marketing Cluster - Content Ideation
Trigger: Schedule (Every day at 00:00)
Actions:
  1. Google Trends Lookup: Trending topics for "joias femininas", "organização", "revendedor"
  2. Code by Zapier:
     - Generate 10 content ideas based on trends
     - Hook into Gemini for enrichment (optional)
     - Assign to SABRINA for approval at 06:00
  3. Create Spreadsheet Row: Content ideas (title, angle, format, estimated reach)
  4. Send Slack: #content-ideas with top 3 ideas
```

**Content Angles:**
- Antes/Depois (Before/After organization)
- Tips & Hacks
- Customer testimonials
- Product reviews
- Trending sounds (short-form video)

---

## ⚙️ SKILL #5: FRED Copywriting

**Trigger:** Manual + Schedule (00:30 daily)

```yaml
Name: Marketing Cluster - Copy Variants
Trigger: Manual or Schedule (00:30 daily)
Actions:
  1. Get Spreadsheet: Content ideas approved by SABRINA
  2. Code by Zapier:
     - Generate 5+ copy variations per idea
     - A/B test hooks
     - Include CTAs (Try free 30 days, Join resellers, etc.)
  3. Update Spreadsheet: Copy variants tab
  4. Create Slack thread: #content-ideas with copy options
```

---

## ⚙️ SKILL #6: LUDMILO Design Generation

**Trigger:** Schedule (06:00 daily)

```yaml
Name: Marketing Cluster - Design & Landing Pages
Trigger: Schedule (Every day at 06:00)
Actions:
  1. Get Spreadsheet: Approved content + copy
  2. Trigger Canva API: Create design from template
     - Instagram post (1080x1350)
     - Story (1080x1920)
     - Ad banner (1200x628)
  3. Store file URLs in Spreadsheet
  4. Send Slack: Design preview links
  5. Create approval task (SABRINA to approve)
```

---

## ⚙️ SKILL #7: LUNA Lead Qualification

**Trigger:** Schedule (10:00 daily) + Webhook (when new lead arrives)

```yaml
Name: Sales Cluster - Lead Qualification
Trigger: Schedule OR Webhook (new_lead)
Actions:
  1. Get New Leads from Supabase (status: "new")
  2. Send WhatsApp via WhatsApp Business API:
     - "Oi! 👋 Vi que você se interessou em Luxi. Vamos começar?"
     - Link to 30-day trial
     - Collect response
  3. Code by Zapier:
     - Parse response for qualifying signals
     - Score lead (hot/warm/cold)
  4. Update Supabase: lead status, qualification score
  5. If hot → trigger MARCUS follow-up (same day)
```

---

## ⚙️ SKILL #8: MARCUS Sales Follow-up & Closing

**Trigger:** Webhook (when LUNA qualifies hot lead)

```yaml
Name: Sales Cluster - Warm Lead Follow-up & Closing
Trigger: Webhook (luna_qualified_hot_lead)
Actions:
  1. Get Lead Details from Supabase
  2. Send WhatsApp Message:
     - Personalized (use name)
     - Pain point acknowledgment
     - Demo offer or trial extension
  3. Track Response in Supabase
  4. If responses positively → Payment step:
     - Generate Stripe payment link
     - Send via WhatsApp
     - Wait for payment
  5. When payment received → trigger IRIS onboarding
```

---

## ⚙️ SKILL #9: GALDINO CRM Sync

**Trigger:** Schedule (12:00 daily) + Webhook (new lead/purchase)

```yaml
Name: Operations Cluster - CRM Pipeline Update
Trigger: Schedule (12:00) OR Webhook (new_event)
Actions:
  1. Query Supabase: Get all leads with status updates
  2. Sync to CRM (if using RD Station, HubSpot, or custom):
     - Insert new leads
     - Update statuses
     - Add pipeline stage
  3. Code by Zapier:
     - Segment by source (Instagram, WhatsApp, organic)
     - Tag hot/warm/cold
  4. Generate pipeline report (Google Sheets)
  5. Send Slack: Pipeline snapshot
```

---

## ⚙️ SKILL #10: IRIS Onboarding + Customer Success

**Trigger:** Webhook (payment_received)

```yaml
Name: CS Cluster - Onboarding Sequence & Retention
Trigger: Webhook (payment_received) OR Schedule (12:00)
Actions:
  1. Get New Customer from Stripe webhook
  2. Create Onboarding Task in Supabase
  3. Send Email Sequence:
     - Day 0: Welcome + feature intro
     - Day 1: First walk-through video
     - Day 3: Success story (similar customer)
     - Day 7: "How's it going?" check-in
     - Day 14: Advanced features
  4. Track engagement in Supabase
  5. If no usage by day 7 → trigger reactivation sequence:
     - Offer live demo
     - Personal support offer
```

---

## ⚙️ SKILL #11: MBAKU Ad Campaign Optimization

**Trigger:** Schedule (18:00 daily)

```yaml
Name: Growth Cluster - Paid Ad Optimization
Trigger: Schedule (Every day at 18:00)
Actions:
  1. Fetch Ad Metrics from Google Ads + Facebook Ads API:
     - Spend, clicks, conversions, CPC, ROAS
  2. Code by Zapier:
     - Identify underperforming campaigns (ROAS < 2x)
     - Find top performers (ROAS > 4x)
  3. Apply Optimizations:
     - Pause campaigns with ROAS < 1.5x
     - Increase budget on ROAS > 3x by 20%
     - Adjust bid strategy (CPC or ROAS target)
  4. Create A/B tests:
     - New audience segments
     - New creative variations
  5. Report Slack: Budget changes + test setup
  6. Record Supabase: ad_performance log
```

---

## ⚙️ SKILL #12: JOÃO B2B Partnerships

**Trigger:** Schedule (16:00 daily) + Manual

```yaml
Name: Strategy Cluster - Partnership Outreach
Trigger: Schedule (16:00) OR Manual button
Actions:
  1. Identify Partnership Prospects:
     - Email lists (jewelry retailers, reseller platforms)
     - LinkedIn search (jewelry industry)
  2. Generate Outreach Email:
     - Personalized subject line
     - Co-marketing proposal
     - Revenue share offer (e.g., 30% affiliate commission)
  3. Send via Email
  4. Log in Spreadsheet: Partnership pipeline
  5. Track responses (manual update or Zapier webhook)
```

---

## ⚙️ SKILL #13: MIKIMBA Market Prospecting

**Trigger:** Schedule (16:00 daily)

```yaml
Name: Strategy Cluster - Market Research & Expansion
Trigger: Schedule (Every day at 16:00)
Actions:
  1. Google Trends: Search for:
     - Jewelry keywords by region/country
     - Competing platforms
     - Market size trends
  2. Social Media Listening: Hashtag analysis
  3. Code by Zapier:
     - Identify emerging markets
     - Segment by opportunity size
     - Estimate lead potential
  4. Create Spreadsheet: Market opportunities
  5. Send Slack: Top 3 new markets to explore
```

---

## ⚙️ SKILL #14: HECTOR API Debugging & Integration

**Trigger:** Manual button + Webhook (on critical error)

```yaml
Name: Technical Cluster - Dev Automation & Debugging
Trigger: Manual OR Webhook (critical_error)
Actions:
  1. Get Error Log from Supabase or Slack
  2. Code by Zapier:
     - Parse error type
     - Identify root cause
  3. If Stripe issue → Re-trigger Stripe Edge Function
  4. If API timeout → Retry with backoff
  5. If new integration needed → Create GitHub issue
  6. Send Slack: Incident summary + fix status
  7. For Claude Sonnet issues → POST to Claude API for deeper analysis
```

---

## ⚙️ SKILL #15: ANINHA Email Marketing Campaigns

**Trigger:** Schedule (20:00 daily)

```yaml
Name: Engagement Cluster - Email Campaigns & Reactivation
Trigger: Schedule (Every day at 20:00)
Actions:
  1. Query Supabase:
     - New leads (send welcome sequence)
     - Free trial users (day 7 urgency email)
     - Inactive users (reactivation offer)
  2. Segment by engagement:
     - High engagers → upsell email
     - At-risk (no login 7 days) → retention offer
  3. Send via Email API (SendGrid, Mailgun, etc.)
  4. Track opens/clicks in Supabase
  5. Generate report: Email performance metrics
```

---

## ⚙️ SKILL #16: JONNY Community Engagement

**Trigger:** Schedule (20:00 daily) + Webhook (new comment)

```yaml
Name: Engagement Cluster - Community & DM Response
Trigger: Schedule (20:00) OR Webhook (new_comment/dm)
Actions:
  1. Fetch Instagram/Facebook API:
     - New comments on posts
     - New DMs
  2. Filter: Only messages requiring response
  3. Generate Response via Gemini API:
     - Answer questions
     - Thank for comments
     - Offer trial link if interested
  4. Send via Instagram/Facebook API
  5. Log in Supabase: engagement_log
  6. Monitor sentiment: Flag negative comments for Clebe review
```

---

## ⚙️ SKILL #17: NIX Growth Strategy

**Trigger:** Schedule (12:00 daily)

```yaml
Name: Strategy Cluster - Growth Analysis & Optimization
Trigger: Schedule (Every day at 12:00)
Actions:
  1. Get All Channel Data:
     - Instagram organic + paid
     - Email performance
     - Referral traffic
     - Direct traffic
  2. Calculate Metrics per Channel:
     - Cost per lead
     - Cost per trial
     - Cost per paid customer
     - ROI by channel
  3. Code by Zapier:
     - Rank channels by efficiency
     - Recommend budget reallocation
     - Identify optimization opportunities
  4. Update Dashboard: Google Sheets
  5. Send Slack: Weekly growth summary (Mondays + Thursdays)
```

---

## 🔗 Webhook URLs (Zapier Catch)

Each Skill has a unique Zapier Catch webhook:

```
https://hooks.zapier.com/hooks/catch/17/[ZANKA_ID]/
https://hooks.zapier.com/hooks/catch/17/[DIANA_ID]/
https://hooks.zapier.com/hooks/catch/17/[NEJI_ID]/
... (17 total)
```

**Usage:**
- Stripe webhook → sends to MARCUS (when payment received)
- Instagram webhook → sends to LUNA/JONNY (new DM or comment)
- Supabase function → sends to IRIS (onboarding trigger)

---

## 📊 Integration Map

```
Zapier Skills (17)
        ↓
Supabase (task_queue, agent_performance, task_logs)
        ↓
Google Sheets (Dashboard, metrics, CRM)
        ↓
Slack (reports, alerts)
        ↓
Email (campaigns, alerts)
        ↓
Stripe (payment webhook)
        ↓
APIs (Google Ads, Facebook Ads, Instagram, WhatsApp, Email)
```

---

## 🚀 Deployment Steps

1. **Create Project in Zapier** (if not exists)
2. **Connect Apps:**
   - Supabase
   - Google Sheets
   - Slack
   - Email (SendGrid)
   - Stripe
   - Google Ads / Facebook Ads
   - Instagram Graph API
   - WhatsApp Business API
3. **Import 17 Skills** (copy-paste from above)
4. **Test Each Skill:**
   - Trigger manually
   - Check Slack notification
   - Verify Supabase records
5. **Enable All Schedules** (activate automation)
6. **Monitor in Slack** (#zanka-reports) during first 24h

---

## ⏰ Full 24h Activation Timeline

```
00:00 → SABRINA ideation + FRED copywriting
06:00 → LUDMILO designs
07:00 → DIANA metrics consolidation
08:00 → ZANKA standup + dispatch
10:00 → LUNA qualification + MARCUS follow-up
12:00 → GALDINO CRM + IRIS CS + NIX growth
14:00 → HECTOR debugging (on-demand)
16:00 → JOÃO partnerships + MIKIMBA prospecting
18:00 → MBAKU ad optimization
20:00 → JONNY engagement + ANINHA email
23:00 → NEJI QA audit
04:00 → DIANA full consolidation
```

---

## 🎯 Success Metrics (First 7 Days)

- ✅ All 17 agents activated
- ✅ 0 critical failures
- ✅ >150 leads captured
- ✅ >20 trials generated
- ✅ Slack reports flowing
- ✅ Supabase logging all tasks

---

## 📞 Support

If any Skill fails:
1. Check Slack #zanka-alerts
2. Review Supabase task_logs
3. Trigger HECTOR debugging skill
4. Escalate to Clebe via Slack DM
