-- ZANKA HQ — Supabase Setup (Copy & Paste in SQL Editor)
-- Project: lumi (eraxjtfedswksiyigasf.supabase.co)
-- Region: São Paulo

-- ============================================
-- TABLE 1: task_queue (Agent task tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS task_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  agent_id VARCHAR(50) NOT NULL,  -- ZANKA, DIANA, NEJI, etc.
  task_type VARCHAR(100) NOT NULL,  -- "content_ideation", "lead_qualification", etc.
  status VARCHAR(20) DEFAULT 'pending',  -- pending, running, completed, failed
  priority INT DEFAULT 5,  -- 1=critical, 5=normal, 10=low
  
  scheduled_time TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  input_data JSONB,  -- Parameters for the task
  output_data JSONB,  -- Results from the task
  error_message TEXT,
  
  retry_count INT DEFAULT 0,
  max_retries INT DEFAULT 3,
  
  zapier_id VARCHAR(100),  -- Zapier execution ID
  slack_thread_ts VARCHAR(100),  -- Slack thread for discussion
  
  created_by VARCHAR(50) DEFAULT 'system',
  
  CONSTRAINT status_check CHECK (status IN ('pending', 'running', 'completed', 'failed', 'paused'))
);

CREATE INDEX idx_task_queue_agent ON task_queue(agent_id);
CREATE INDEX idx_task_queue_status ON task_queue(status);
CREATE INDEX idx_task_queue_scheduled_time ON task_queue(scheduled_time);

-- ============================================
-- TABLE 2: task_logs (Detailed execution logs)
-- ============================================
CREATE TABLE IF NOT EXISTS task_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  task_id UUID NOT NULL REFERENCES task_queue(id) ON DELETE CASCADE,
  agent_id VARCHAR(50) NOT NULL,
  log_level VARCHAR(20),  -- debug, info, warn, error, critical
  message TEXT,
  
  metrics JSONB,  -- Timestamp, duration, tokens_used, api_calls
  context JSONB,  -- Additional context
  
  created_by VARCHAR(50) DEFAULT 'system'
);

CREATE INDEX idx_task_logs_task_id ON task_logs(task_id);
CREATE INDEX idx_task_logs_agent_id ON task_logs(agent_id);
CREATE INDEX idx_task_logs_log_level ON task_logs(log_level);

-- ============================================
-- TABLE 3: agent_performance (Daily metrics)
-- ============================================
CREATE TABLE IF NOT EXISTS agent_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  agent_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  
  -- Execution metrics
  tasks_completed INT DEFAULT 0,
  tasks_failed INT DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,  -- Percentage
  avg_execution_time_ms INT,
  
  -- Business metrics (varies by agent)
  leads_generated INT DEFAULT 0,
  leads_qualified INT DEFAULT 0,
  conversions INT DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  
  -- Quality metrics
  error_count INT DEFAULT 0,
  retry_count INT DEFAULT 0,
  api_calls INT DEFAULT 0,
  tokens_used INT DEFAULT 0,
  
  -- Cost tracking
  api_cost DECIMAL(10,4) DEFAULT 0,
  
  notes TEXT,
  
  UNIQUE(agent_id, date)
);

CREATE INDEX idx_agent_performance_agent_id ON agent_performance(agent_id);
CREATE INDEX idx_agent_performance_date ON agent_performance(date);

-- ============================================
-- TABLE 4: leads (Lead tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Lead info
  name VARCHAR(150),
  phone VARCHAR(20),
  email VARCHAR(150),
  instagram_username VARCHAR(100),
  
  -- Qualification
  source VARCHAR(50),  -- instagram, whatsapp_dm, email, referral, ad
  lead_score INT DEFAULT 0,  -- 0-100 (LUNA qualification)
  status VARCHAR(30) DEFAULT 'new',  -- new, qualified, trial_sent, trial_active, trial_expired, converted, lost
  
  -- Trial tracking
  trial_link_sent_at TIMESTAMP,
  trial_activated_at TIMESTAMP,
  trial_expires_at TIMESTAMP,
  trial_id VARCHAR(100),
  
  -- Payment
  payment_id VARCHAR(100),
  payment_status VARCHAR(30),  -- pending, completed, failed
  paid_at TIMESTAMP,
  subscription_id VARCHAR(100),
  
  -- Engagement
  last_message_at TIMESTAMP,
  last_message_from VARCHAR(50),  -- whatsapp, email, instagram
  
  -- Notes
  notes TEXT,
  objections JSONB,  -- Common objections encountered
  
  assigned_to VARCHAR(50),  -- Sales rep or agent
  created_by VARCHAR(50) DEFAULT 'system'
);

CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_phone ON leads(phone);

-- ============================================
-- TABLE 5: content_queue (Content scheduling)
-- ============================================
CREATE TABLE IF NOT EXISTS content_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  content_type VARCHAR(50),  -- instagram_post, email_campaign, whatsapp_message
  title VARCHAR(200),
  
  -- Content variants
  copy_main TEXT,
  copy_variants JSONB,  -- Array of alternative copies
  design_url TEXT,
  
  -- Scheduling
  scheduled_post_time TIMESTAMP,
  posted_at TIMESTAMP,
  status VARCHAR(30) DEFAULT 'draft',  -- draft, scheduled, posted, paused, failed
  
  -- Performance
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  
  -- Attribution
  created_by_agent VARCHAR(50),  -- SABRINA, ANINHA, etc.
  approved_by VARCHAR(50),  -- SABRINA or LUDMILO
  approved_at TIMESTAMP
);

CREATE INDEX idx_content_queue_status ON content_queue(status);
CREATE INDEX idx_content_queue_scheduled_post_time ON content_queue(scheduled_post_time);

-- ============================================
-- TABLE 6: daily_metrics (Consolidated KPIs)
-- ============================================
CREATE TABLE IF NOT EXISTS daily_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  date DATE NOT NULL UNIQUE,
  
  -- Lead metrics
  leads_total INT DEFAULT 0,
  leads_by_source JSONB,  -- {instagram: 50, whatsapp: 30, ...}
  
  -- Trial metrics
  trials_sent INT DEFAULT 0,
  trials_activated INT DEFAULT 0,
  trial_activation_rate DECIMAL(5,2),
  
  -- Conversion
  conversions_paid INT DEFAULT 0,
  conversion_rate DECIMAL(5,2),  -- trial to paid
  
  -- Revenue
  revenue_total DECIMAL(10,2) DEFAULT 0,
  cac DECIMAL(10,2),  -- Customer Acquisition Cost
  ltv DECIMAL(10,2),  -- Lifetime Value
  
  -- Ad spend
  ad_spend DECIMAL(10,2) DEFAULT 0,
  ad_roas DECIMAL(5,2),  -- ROAS (Return On Ad Spend)
  
  -- Email
  email_open_rate DECIMAL(5,2),
  email_click_rate DECIMAL(5,2),
  
  -- Social
  instagram_impressions INT DEFAULT 0,
  instagram_engagement_rate DECIMAL(5,2),
  
  -- Shopee (if applicable)
  shopee_clicks INT DEFAULT 0,
  shopee_sales INT DEFAULT 0,
  shopee_revenue DECIMAL(10,2) DEFAULT 0,
  
  notes TEXT
);

CREATE INDEX idx_daily_metrics_date ON daily_metrics(date);

-- ============================================
-- TABLE 7: agent_alerts (Critical alerts)
-- ============================================
CREATE TABLE IF NOT EXISTS agent_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  
  agent_id VARCHAR(50),
  alert_type VARCHAR(50),  -- api_failure, high_error_rate, low_performance, cost_spike
  severity VARCHAR(20) DEFAULT 'warning',  -- info, warning, critical
  
  message TEXT,
  recommended_action TEXT,
  
  status VARCHAR(30) DEFAULT 'active',  -- active, acknowledged, resolved
  
  slack_thread_ts VARCHAR(100),
  
  created_by VARCHAR(50) DEFAULT 'system'
);

CREATE INDEX idx_agent_alerts_agent_id ON agent_alerts(agent_id);
CREATE INDEX idx_agent_alerts_severity ON agent_alerts(severity);
CREATE INDEX idx_agent_alerts_status ON agent_alerts(status);

-- ============================================
-- TABLE 8: partnerships (B2B partnerships)
-- ============================================
CREATE TABLE IF NOT EXISTS partnerships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  partner_name VARCHAR(150),
  partner_email VARCHAR(150),
  contact_person VARCHAR(100),
  
  partnership_type VARCHAR(50),  -- affiliate, co_marketing, referral, reseller
  
  revenue_share_percent DECIMAL(5,2),  -- e.g., 30%
  
  -- Status
  status VARCHAR(30) DEFAULT 'prospect',  -- prospect, negotiating, active, paused, ended
  
  outreach_count INT DEFAULT 0,
  last_outreach_date TIMESTAMP,
  
  -- Performance
  leads_generated INT DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  
  deal_terms TEXT,
  contract_url TEXT,
  
  notes TEXT
);

CREATE INDEX idx_partnerships_status ON partnerships(status);

-- ============================================
-- FUNCTION 1: update_agent_daily_metrics
-- ============================================
CREATE OR REPLACE FUNCTION update_agent_daily_metrics(
  agent_id_param VARCHAR(50),
  date_param DATE
)
RETURNS JSONB AS $$
DECLARE
  metrics JSONB;
  completed_count INT;
  failed_count INT;
BEGIN
  SELECT COUNT(*) INTO completed_count
  FROM task_queue
  WHERE agent_id = agent_id_param
    AND status = 'completed'
    AND DATE(completed_at) = date_param;
  
  SELECT COUNT(*) INTO failed_count
  FROM task_queue
  WHERE agent_id = agent_id_param
    AND status = 'failed'
    AND DATE(completed_at) = date_param;
  
  INSERT INTO agent_performance (agent_id, date, tasks_completed, tasks_failed, success_rate)
  VALUES (
    agent_id_param,
    date_param,
    completed_count,
    failed_count,
    CASE WHEN (completed_count + failed_count) > 0
      THEN ROUND((completed_count::DECIMAL / (completed_count + failed_count)) * 100, 2)
      ELSE 0
    END
  )
  ON CONFLICT (agent_id, date) DO UPDATE SET
    tasks_completed = EXCLUDED.tasks_completed,
    tasks_failed = EXCLUDED.tasks_failed,
    success_rate = EXCLUDED.success_rate,
    updated_at = CURRENT_TIMESTAMP;
  
  SELECT jsonb_build_object(
    'agent_id', agent_id_param,
    'date', date_param,
    'tasks_completed', completed_count,
    'tasks_failed', failed_count,
    'success_rate', ROUND((completed_count::DECIMAL / NULLIF(completed_count + failed_count, 0)) * 100, 2)
  ) INTO metrics;
  
  RETURN metrics;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION 2: check_agent_health
-- ============================================
CREATE OR REPLACE FUNCTION check_agent_health(agent_id_param VARCHAR(50))
RETURNS JSONB AS $$
DECLARE
  health_status JSONB;
  error_count INT;
  success_rate DECIMAL;
  last_task TIMESTAMP;
  avg_execution_ms INT;
BEGIN
  -- Get recent metrics
  SELECT error_count, success_rate, avg_execution_time_ms INTO error_count, success_rate, avg_execution_ms
  FROM agent_performance
  WHERE agent_id = agent_id_param
  ORDER BY date DESC
  LIMIT 1;
  
  SELECT completed_at INTO last_task
  FROM task_queue
  WHERE agent_id = agent_id_param
  ORDER BY completed_at DESC
  LIMIT 1;
  
  -- Determine health status
  health_status := jsonb_build_object(
    'agent_id', agent_id_param,
    'status', CASE
      WHEN success_rate >= 95 THEN 'healthy'
      WHEN success_rate >= 80 THEN 'degraded'
      ELSE 'unhealthy'
    END,
    'success_rate', success_rate,
    'error_count_24h', error_count,
    'last_task_at', last_task,
    'avg_execution_ms', avg_execution_ms
  );
  
  -- Create alert if unhealthy
  IF (health_status->>'status') = 'unhealthy' THEN
    INSERT INTO agent_alerts (agent_id, alert_type, severity, message, recommended_action)
    VALUES (
      agent_id_param,
      'high_error_rate',
      'critical',
      'Agent success rate below 80%: ' || success_rate || '%',
      'Check agent logs in Supabase. Restart agent via Zapier. Contact Clebe.'
    );
  END IF;
  
  RETURN health_status;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- REALTIME SUBSCRIPTIONS (for Slack alerts)
-- ============================================

-- Alert on critical agent failures
CREATE TRIGGER trigger_critical_alert
AFTER INSERT OR UPDATE ON agent_alerts
FOR EACH ROW
WHEN (NEW.severity = 'critical' AND NEW.status = 'active')
EXECUTE FUNCTION notify_critical_alert_webhook();

-- ============================================
-- VIEWS (for dashboards)
-- ============================================

CREATE OR REPLACE VIEW agent_health_summary AS
SELECT
  ap.agent_id,
  ap.date,
  ap.tasks_completed,
  ap.tasks_failed,
  ap.success_rate,
  ap.avg_execution_time_ms,
  ap.error_count,
  CASE
    WHEN ap.success_rate >= 95 THEN '✅ Healthy'
    WHEN ap.success_rate >= 80 THEN '⚠️ Degraded'
    ELSE '🔴 Unhealthy'
  END AS health_status
FROM agent_performance ap
ORDER BY ap.date DESC, ap.agent_id;

CREATE OR REPLACE VIEW daily_lead_pipeline AS
SELECT
  DATE(created_at) as date,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
  COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_leads,
  COUNT(CASE WHEN status = 'trial_active' THEN 1 END) as active_trials,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_customers,
  COUNT(*) as total_leads
FROM leads
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW agent_task_queue_status AS
SELECT
  agent_id,
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (COALESCE(completed_at, CURRENT_TIMESTAMP) - started_at))) as avg_duration_seconds
FROM task_queue
WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY agent_id, status;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (optional)
-- ============================================

-- Restrict leads to authorized users
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON leads
  FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- BACKUPS (automated)
-- ============================================

-- Note: Enable automated backups in Supabase console
-- Settings → Backups → Enable automatic daily backups

-- ============================================
-- DONE! Next steps:
-- ============================================

-- 1. Copy this entire SQL
-- 2. Go to: https://app.supabase.com/project/eraxjtfedswksiyigasf/sql/new
-- 3. Paste and execute
-- 4. Verify all tables created:
--    SELECT * FROM information_schema.tables WHERE table_schema = 'public';
-- 5. Enable Realtime for agent_alerts (so Slack gets notified instantly)
-- 6. Connect Zapier to these tables
