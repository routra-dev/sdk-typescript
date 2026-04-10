/**
 * Hand-written management types derived from the Routra OpenAPI spec.
 *
 * These cover the ~15 management endpoints (keys, policies, usage, billing,
 * webhooks, BYOK, batch, notifications, providers). We intentionally keep
 * these hand-written vs codegen because:
 *   - The OpenAPI spec is our own, changes are infrequent and deliberate
 *   - 15 classes < 200 lines is trivial to maintain vs codegen pipeline
 *   - No extra dev dependency, no broken pipelines, no dead code
 */

// ── API Keys ──────────────────────────────────────────────────────────────────

export interface CreateKeyRequest {
  name: string;
  policy_id?: string | null;
}

export interface CreateKeyResponse {
  id: string;
  key: string;
  name: string;
  prefix: string;
  policy_id?: string | null;
  created_at: string;
}

export interface KeySummary {
  id: string;
  name: string;
  prefix: string;
  policy_id?: string | null;
  last_used_at?: string | null;
  created_at: string;
}

// ── Policies ──────────────────────────────────────────────────────────────────

export interface CreatePolicyRequest {
  name: string;
  strategy?: string;
  constraints?: Record<string, unknown>;
}

export interface PolicyResponse {
  id: string;
  name: string;
  strategy: string;
  constraints: Record<string, unknown>;
  created_at: string;
}

// ── Usage ─────────────────────────────────────────────────────────────────────

export interface ModalityUsage {
  usage_unit: string;
  request_count: number;
  total_cost_usd: number;
  total_usage_value: number;
}

export interface UsageSummary {
  total_requests: number;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cost_usd: number;
  period: string;
  modality_breakdown: ModalityUsage[];
}

export interface CostBreakdownItem {
  model: string;
  provider: string;
  total_cost_usd: number;
  request_count: number;
}

export interface RequestLogEntry {
  id: string;
  model: string;
  provider: string;
  strategy: string;
  latency_ms?: number | null;
  cost_usd: number;
  input_tokens?: number | null;
  output_tokens?: number | null;
  usage_unit?: string | null;
  usage_value?: number | null;
  status_code?: number | null;
  error_code?: string | null;
  created_at: string;
}

// ── Billing ───────────────────────────────────────────────────────────────────

export interface BillingInfo {
  billing_tier: string;
  credit_balance_usd: number;
  spend_month_usd: number;
  spend_cap_usd?: number | null;
  subscription_status?: string | null;
  current_period_end?: string | null;
}

export interface CreateCheckoutRequest {
  plan: string;
  success_url: string;
  cancel_url: string;
}

export interface CreateCheckoutResponse {
  checkout_url: string;
}

export interface TopupRequest {
  amount_usd: number;
  success_url: string;
  cancel_url: string;
}

// ── Batch ─────────────────────────────────────────────────────────────────────

export interface BatchRequestItem {
  custom_id: string;
  method: string;
  url: string;
  body: Record<string, unknown>;
}

export interface CreateBatchRequest {
  requests: BatchRequestItem[];
  metadata?: Record<string, string>;
}

export interface BatchJobResponse {
  id: string;
  status: string;
  total: number;
  completed: number;
  failed: number;
  metadata?: Record<string, string> | null;
  created_at: string;
  completed_at?: string | null;
}

// ── Webhooks ──────────────────────────────────────────────────────────────────

export interface CreateWebhookRequest {
  url: string;
  events: string[];
}

export interface WebhookEndpointResponse {
  id: string;
  url: string;
  events: string[];
  created_at: string;
}

// ── BYOK (Provider Keys) ─────────────────────────────────────────────────────

export interface StoreKeyRequest {
  api_key: string;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface NotificationPreferenceResponse {
  event_type: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  webhook_enabled: boolean;
}

export interface UpdatePreferenceRequest {
  email_enabled?: boolean;
  in_app_enabled?: boolean;
  webhook_enabled?: boolean;
}

export interface InboxItemResponse {
  id: string;
  event_type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

// ── Providers ─────────────────────────────────────────────────────────────────

export interface ProviderInfo {
  id: string;
  slug: string;
  name: string;
  health: HealthStatus;
}

export interface HealthStatus {
  state: string;
  latency_ms?: number | null;
}

// ── Audit Log ─────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  details?: Record<string, unknown> | null;
  created_at: string;
}
