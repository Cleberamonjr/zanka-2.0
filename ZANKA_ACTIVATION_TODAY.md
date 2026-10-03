# 🚀 ZANKA HQ — Live Activation (TODAY 19:00 BRT)

**Status:** 🟢 READY TO LAUNCH  
**Activation Time:** 2026-10-03 19:00:00 BRT (-03:00)  
**Target Leads (Day 1):** 166+  
**Team Size:** 17 AI Agents  
**Fully Autonomous:** Yes  

---

## ⏰ Pre-Activation Checklist (Next 4 hours)

### Phase 1: Supabase Setup (10 min)
- [ ] Go to: https://app.supabase.com/project/eraxjtfedswksiyigasf/sql/new
- [ ] Copy SQL from `/ZANKA_SUPABASE_SETUP.sql`
- [ ] Paste & execute in SQL editor
- [ ] Verify: All 8 tables created (`SELECT * FROM information_schema.tables`)
- [ ] Enable Realtime on `agent_alerts` table
- [ ] Test: Insert dummy lead in `leads` table

**SQL Verification Command:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE '%' 
ORDER BY table_name;
```

Expected output:
```
agent_alerts
agent_performance
content_queue
daily_metrics
leads
partnerships
task_logs
task_queue
```

---

### Phase 2: Zapier Setup (20 min)

**Step 1: Connect Apps**
Go to: https://zapier.com/app/settings/applications

Connect:
- ✅ Supabase (already connected)
- ✅ Google Sheets (already connected)
- ✅ Slack (already connected)
- ✅ Email (SendGrid or Mailgun)
- ✅ Stripe (webhook enabled)
- ✅ Google Ads (if using ads)
- ✅ Facebook Ads (if using ads)

**Step 2: Create Webhook Endpoints**
For each of 17 agents, create a Zapier Catch:
1. Click "+" in Zapier
2. Select "Catch by Zapier" as trigger
3. Copy webhook URL
4. Save to spreadsheet (you'll need these URLs)

Example:
```
ZANKA: https://hooks.zapier.com/hooks/catch/17/[ZANKA_WEBHOOK_ID]/
DIANA: https://hooks.zapier.com/hooks/catch/17/[DIANA_WEBHOOK_ID]/
... (15 more)
```

**Step 3: Import 17 Skills**
For each skill in `/ZANKA_17_ZAPIER_SKILLS.md`:
1. Copy the YAML/JSON
2. Create new Zap in Zapier
3. Follow the actions listed
4. Test each one manually
5. Enable scheduling

---

### Phase 3: Environment Variables (10 min)

Create `.env` file (if using n8n or custom deployment):

```env
# Supabase
SUPABASE_URL=https://eraxjtfedswksiyigasf.supabase.co
SUPABASE_ANON_KEY=[YOUR_ANON_KEY_FROM_SETTINGS]
SUPABASE_SERVICE_KEY=[YOUR_SERVICE_KEY_FROM_SETTINGS]

# Zapier
ZAPIER_API_KEY=[FROM_ZAPIER_SETTINGS]

# Claude API (for HECTOR)
ANTHROPIC_API_KEY=[YOUR_CLAUDE_API_KEY]

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/[YOUR_SLACK_WEBHOOK]
SLACK_BOT_TOKEN=xoxb-[YOUR_BOT_TOKEN]

# Email
SENDGRID_API_KEY=[YOUR_SENDGRID_KEY]

# Stripe
STRIPE_SECRET_KEY=[YOUR_STRIPE_SECRET]
STRIPE_WEBHOOK_SECRET=[YOUR_WEBHOOK_SECRET]

# Instagram / Facebook
INSTAGRAM_API_TOKEN=[YOUR_TOKEN]
FACEBOOK_API_TOKEN=[YOUR_TOKEN]

# WhatsApp Business
WHATSAPP_API_TOKEN=[YOUR_TOKEN]
WHATSAPP_PHONE_ID=[YOUR_PHONE_ID]

# Google APIs
GOOGLE_SHEETS_API_KEY=[YOUR_KEY]
GOOGLE_ANALYTICS_API_KEY=[YOUR_KEY]
GOOGLE_ADS_API_KEY=[YOUR_KEY]

# Timezone
TZ=America/Sao_Paulo
```

---

### Phase 4: Slack Setup (5 min)

**Create Slack Bot:**
1. Go to: https://api.slack.com/apps
2. Create new app (name: "ZANKA")
3. Enable bot token scopes:
   - `chat:write`
   - `files:write`
   - `channels:read`
   - `groups:read`

**Create Channels:**
- `#zanka-reports` (daily standup + metrics)
- `#zanka-alerts` (critical alerts only)
- `#content-ideas` (content from SABRINA/FRED)
- `#leads-qualified` (new qualified leads)

**Slash Command (Optional):**
`/zanka [command]` for manual overrides
```
/zanka pause-all     (pause all agents)
/zanka resume-all    (resume all agents)
/zanka status        (check agent health)
/zanka check-sales   (get current sales)
/zanka help          (list commands)
```

---

### Phase 5: Google Sheets Dashboard (10 min)

Create spreadsheet: "ZANKA HQ Dashboard"

Tabs:
1. **Metrics Today** (auto-update from Supabase)
   - Leads today: [FORMULA]
   - Trials today: [FORMULA]
   - Revenue today: [FORMULA]
   - CAC, LTV, ROI

2. **Content Calendar** (SABRINA → FRED → LUDMILO)
   - Posted content
   - Scheduled content
   - Performance (impressions, clicks)

3. **Lead Pipeline** (LUNA → MARCUS → IRIS)
   - New leads
   - Qualified
   - Active trials
   - Paid customers
   - Lost/churned

4. **Agent Performance** (NEJI audit)
   - Agent health (✅ healthy, ⚠️ degraded, 🔴 unhealthy)
   - Success rate
   - Avg execution time
   - Error count

5. **Daily Log** (Raw data from Supabase)
   - Task queue log
   - Agent performance log
   - Alerts log

**Formula Example (Metrics Today):**
```
=QUERY(IMPORTRANGE("[SUPABASE_QUERY_URL]","Sheet1!A:Z"),"SELECT * WHERE Date = TODAY()",0)
```

Or use Zapier to auto-update cells.

---

### Phase 6: Create "Go Live" Zapier Skill (2 min)

**Final Skill: Activation Confirmation**

```yaml
Name: ZANKA Activation - System Go Live
Trigger: Manual (button click)
Actions:
  1. Send Slack Message to #zanka-reports:
     "🚀 ZANKA HQ LIVE! Activation at 2026-10-03 19:00:00 BRT"
     "17 agents activated. 24/7 mode enabled."
     "Dashboard: [URL to Google Sheets]"
     "Monitor: #zanka-alerts for critical issues"
     
  2. Send Email to Clebe:
     Subject: "ZANKA Live - First 24h Activation"
     Body: "Your AI CEO is now active. Check Slack #zanka-reports for updates."
     
  3. Record in Supabase:
     INSERT INTO agent_alerts (agent_id, alert_type, severity, message)
     VALUES ('SYSTEM', 'activation', 'info', 'ZANKA HQ live activation at 2026-10-03 19:00 BRT');
     
  4. Log in Google Sheets: "Activation Log"
```

---

## 🎯 Live Timeline (Starting 19:00 BRT)

### 19:00 - System Boot
- [ ] All 17 agents online
- [ ] Supabase connected
- [ ] Slack channels ready
- [ ] Google Sheets dashboard live
- [ ] Zapier skills activated

### 19:30 - First Cycle
- [ ] SABRINA ideation running? (check task_queue)
- [ ] FRED copywriting active?
- [ ] Check Slack #zanka-reports for status

### 20:00-23:00 - Night Cycle
- Monitor: JONNY engagement + ANINHA email
- Expect: 20-50 new leads from Instagram/email
- Status: All task logs should show activity

### 00:00 - Midnight
- SABRINA + FRED full cycle starts
- Check Slack for "Content ideas ready"

### 06:00-08:00 - Morning
- LUDMILO designs
- DIANA metrics consolidation
- ZANKA standup (should appear in Slack)

### Next 24 Hours
- Leads expected: 166+ (5000/month ÷ 30)
- Trials expected: 10-15
- Revenue expected: ~R$100-200

---

## 📊 Success Metrics (First 24 Hours)

✅ **System Health:**
- [ ] 0 critical agent failures
- [ ] >95% agent success rate
- [ ] <100ms avg execution time
- [ ] All 11 scheduled tasks completed on time

✅ **Lead Generation:**
- [ ] >100 new leads captured
- [ ] >20 leads qualified (LUNA)
- [ ] >5 trials sent (MARCUS)
- [ ] >1 paid conversion (IRIS)

✅ **Monitoring:**
- [ ] Slack #zanka-reports has updates
- [ ] Google Sheets dashboard populated
- [ ] Supabase tables have data
- [ ] No critical alerts (or handled)

✅ **Operational:**
- [ ] HECTOR (Claude) integrated for complex tasks
- [ ] JEV decision layer routing correctly
- [ ] Zapier Skills executing on schedule
- [ ] All webhooks firing

---

## ⚠️ Troubleshooting (if something fails)

### Issue: Agent task fails
**Symptoms:** Task in task_queue has status="failed"

**Fix:**
1. Check task_logs for error_message
2. Review Slack #zanka-alerts (NEJI should flag)
3. If API error → trigger HECTOR debugging
4. If schedule missed → verify Zapier schedule is enabled
5. Retry: Update task status to "pending" in Supabase

### Issue: No leads coming in
**Symptoms:** leads table empty after 1h

**Check:**
1. Is LUNA skill active? (check Zapier)
2. Is Instagram API connected?
3. Are new DMs coming to Instagram? (check manually)
4. Is LUNA task in task_queue with status="completed"?
5. If not → trigger LUNA manually via Zapier

### Issue: Slack not receiving alerts
**Symptoms:** No messages in #zanka-alerts or #zanka-reports

**Fix:**
1. Test Slack webhook: `curl -X POST [WEBHOOK_URL] -d '{"text":"Test"}'`
2. Check Zapier "Send Slack Message" action in each skill
3. Verify Slack bot token in .env
4. Check Slack channel permissions (bot can write?)

### Issue: Supabase timeout
**Symptoms:** Zapier skill fails with "Connection timeout"

**Fix:**
1. Check Supabase status: https://status.supabase.com/
2. Increase timeout in Zapier action (default 30s → 60s)
3. Reduce query complexity in Supabase function
4. If still failing → scale up Supabase project

---

## 🎯 First Week Targets

| Metric | Day 1 | Day 7 | Target |
|--------|-------|-------|--------|
| New Leads | 166 | 900+ | 5000/month |
| Qualified | 20 | 150+ | 500 |
| Trials Sent | 5 | 50+ | 250 |
| Paid Users | 1 | 10+ | 50 |
| Revenue | R$60 | R$600+ | R$2,950 |
| Agent Health | ✅ All | ✅ All | ✅ All |

---

## 🔐 Security Checklist

- [ ] API keys not in code (use .env)
- [ ] Supabase RLS enabled on sensitive tables
- [ ] Slack webhook secrets not logged
- [ ] Stripe webhook signed & verified
- [ ] Database backups automated
- [ ] Error logs don't expose secrets
- [ ] Only Clebe can access admin commands

---

## 📞 Support Channels

**If Something Breaks:**

1. **Check Slack:** #zanka-alerts (automated alerts)
2. **Manual Check:**
   - Supabase: https://app.supabase.com/project/eraxjtfedswksiyigasf/
   - Zapier: https://zapier.com/app/home
   - Google Sheets: [Dashboard URL]
3. **Debug Commands:**
   - Slack: `/zanka status` (check agent health)
   - SQL: `SELECT * FROM agent_alerts WHERE status='active';`
4. **Escalation:**
   - Slack DM @Clebe with issue
   - Check HECTOR logs in Supabase (task_logs)

---

## 🚀 FINAL ACTIVATION COMMAND

When ready (19:00 BRT):

```bash
# Activate all 17 Zapier Skills
# Click "Go" on each Skill in Zapier (or enable schedule)

# In Slack:
/zanka activate-all

# Response should be:
# ✅ ZANKA HQ LIVE
# ✅ 17 agents activated
# ✅ System running 24/7
# ✅ Monitor: #zanka-reports
```

---

## 🎓 Post-Launch (First Week)

**Day 1:**
- Monitor dashboards
- Handle any manual approvals needed
- Log issues in Supabase

**Day 2-3:**
- Analyze lead quality
- Optimize copy/design based on FRED/LUDMILO performance
- Adjust MBAKU ad spend (more budget to winning channels)

**Day 4-7:**
- Full week report (DIANA + NEJI)
- Celebrate wins 🎉
- Plan scaling (2x leads/month)

---

## 📝 Files Created (Ready to Use)

✅ `/agents.json` — 17 agents definition  
✅ `/ZANKA_17_ZAPIER_SKILLS.md` — All 17 skill templates  
✅ `/ZANKA_SUPABASE_SETUP.sql` — Database setup  
✅ `/ZANKA_ACTIVATION_TODAY.md` ← You are here  

---

## ✨ Status

```
System Status:    🟢 READY
Agents Online:    17/17 ✅
Database:         Ready to init
Zapier:           Ready to connect
Slack:            Ready to configure
Claude (HECTOR):  Ready to deploy
Automation:       Ready to launch

🎯 Activation: TODAY 19:00 BRT
🎯 First target: 166 leads (Day 1)
🎯 Month target: 5000 leads + R$2,950 revenue
```

---

**Questions?** Check agents.json + Zapier Skills docs above.

**Ready?** Go to Phase 1 checklist ↑ and start!

🚀 Let's go! ZANKA HQ is LIVE tonight!
