/**
 * Routra Management API client.
 *
 * Reuses the parent Routra client's transport (which extends OpenAI) for
 * auth + base URL. Provides typed methods for all management endpoints:
 * keys, policies, usage, billing, batch, webhooks, BYOK, notifications, providers.
 *
 * @example
 * ```ts
 * const client = new Routra({ apiKey: "rtr-..." });
 * const keys = await client.management.keys.list();
 * const usage = await client.management.usage.get();
 * ```
 */
import type {
  CreateKeyRequest,
  CreateKeyResponse,
  KeySummary,
  CreatePolicyRequest,
  PolicyResponse,
  UsageSummary,
  CostBreakdownItem,
  RequestLogEntry,
  BillingInfo,
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  TopupRequest,
  CreateBatchRequest,
  BatchJobResponse,
  CreateWebhookRequest,
  WebhookEndpointResponse,
  StoreKeyRequest,
  NotificationPreferenceResponse,
  UpdatePreferenceRequest,
  InboxItemResponse,
  ProviderInfo,
  AuditLogEntry,
} from "./types.js";

// ── Internal fetch helper ─────────────────────────────────────────────────────

type FetchFn = (path: string, init?: RequestInit) => Promise<Response>;

async function request<T>(fetch: FetchFn, method: string, path: string, body?: unknown): Promise<T> {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { "Content-Type": "application/json" };
  }
  const res = await fetch(path, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Routra API ${method} ${path} failed (${res.status}): ${text}`);
  }
  // 204 No Content — return undefined as T
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Resource namespaces ───────────────────────────────────────────────────────

class KeysResource {
  constructor(private _fetch: FetchFn) {}

  create(body: CreateKeyRequest): Promise<CreateKeyResponse> {
    return request(this._fetch, "POST", "/keys", body);
  }

  list(): Promise<KeySummary[]> {
    return request(this._fetch, "GET", "/keys");
  }

  revoke(id: string): Promise<void> {
    return request(this._fetch, "DELETE", `/keys/${id}`);
  }

  rotate(id: string): Promise<CreateKeyResponse> {
    return request(this._fetch, "POST", `/keys/${id}/rotate`);
  }
}

class PoliciesResource {
  constructor(private _fetch: FetchFn) {}

  create(body: CreatePolicyRequest): Promise<PolicyResponse> {
    return request(this._fetch, "POST", "/policies", body);
  }

  list(): Promise<PolicyResponse[]> {
    return request(this._fetch, "GET", "/policies");
  }
}

class UsageResource {
  constructor(private _fetch: FetchFn) {}

  get(): Promise<UsageSummary> {
    return request(this._fetch, "GET", "/usage");
  }

  costBreakdown(): Promise<CostBreakdownItem[]> {
    return request(this._fetch, "GET", "/usage/cost-breakdown");
  }

  requests(limit = 50, offset = 0): Promise<RequestLogEntry[]> {
    return request(this._fetch, "GET", `/requests?limit=${limit}&offset=${offset}`);
  }
}

class BillingResource {
  constructor(private _fetch: FetchFn) {}

  get(): Promise<BillingInfo> {
    return request(this._fetch, "GET", "/billing");
  }

  createCheckout(body: CreateCheckoutRequest): Promise<CreateCheckoutResponse> {
    return request(this._fetch, "POST", "/billing/checkout", body);
  }

  cancelSubscription(): Promise<void> {
    return request(this._fetch, "DELETE", "/billing/subscription");
  }

  topup(body: TopupRequest): Promise<CreateCheckoutResponse> {
    return request(this._fetch, "POST", "/billing/topup", body);
  }
}

class BatchResource {
  constructor(private _fetch: FetchFn) {}

  create(body: CreateBatchRequest): Promise<BatchJobResponse> {
    return request(this._fetch, "POST", "/batch", body);
  }

  list(): Promise<BatchJobResponse[]> {
    return request(this._fetch, "GET", "/batch");
  }

  status(id: string): Promise<BatchJobResponse> {
    return request(this._fetch, "GET", `/batch/${id}/status`);
  }

  results(id: string): Promise<unknown> {
    return request(this._fetch, "GET", `/batch/${id}/results`);
  }

  cancel(id: string): Promise<void> {
    return request(this._fetch, "POST", `/batch/${id}/cancel`);
  }
}

class WebhooksResource {
  constructor(private _fetch: FetchFn) {}

  create(body: CreateWebhookRequest): Promise<WebhookEndpointResponse> {
    return request(this._fetch, "POST", "/webhooks", body);
  }

  list(): Promise<WebhookEndpointResponse[]> {
    return request(this._fetch, "GET", "/webhooks");
  }

  delete(id: string): Promise<void> {
    return request(this._fetch, "DELETE", `/webhooks/${id}`);
  }
}

class ProviderKeysResource {
  constructor(private _fetch: FetchFn) {}

  store(providerSlug: string, body: StoreKeyRequest): Promise<void> {
    return request(this._fetch, "POST", `/provider-keys/${providerSlug}`, body);
  }

  list(): Promise<Array<{ provider_slug: string; created_at: string }>> {
    return request(this._fetch, "GET", "/provider-keys");
  }

  delete(providerSlug: string): Promise<void> {
    return request(this._fetch, "DELETE", `/provider-keys/${providerSlug}`);
  }

  verify(providerSlug: string): Promise<{ valid: boolean }> {
    return request(this._fetch, "POST", `/provider-keys/${providerSlug}/verify`);
  }
}

class NotificationsResource {
  constructor(private _fetch: FetchFn) {}

  listPreferences(): Promise<NotificationPreferenceResponse[]> {
    return request(this._fetch, "GET", "/notifications/preferences");
  }

  updatePreference(eventType: string, body: UpdatePreferenceRequest): Promise<void> {
    return request(this._fetch, "PUT", `/notifications/preferences`, { event_type: eventType, ...body });
  }

  listInbox(limit = 20, offset = 0): Promise<InboxItemResponse[]> {
    return request(this._fetch, "GET", `/notifications/inbox?limit=${limit}&offset=${offset}`);
  }

  markRead(id: string): Promise<void> {
    return request(this._fetch, "POST", `/notifications/inbox/${id}/read`);
  }

  markAllRead(): Promise<void> {
    return request(this._fetch, "POST", "/notifications/inbox/read-all");
  }

  unreadCount(): Promise<{ count: number }> {
    return request(this._fetch, "GET", "/notifications/inbox/unread-count");
  }
}

class ProvidersResource {
  constructor(private _fetch: FetchFn) {}

  list(): Promise<{ providers: ProviderInfo[] }> {
    return request(this._fetch, "GET", "/providers");
  }

  catalog(): Promise<unknown> {
    return request(this._fetch, "GET", "/models/catalog");
  }
}

class AuditLogResource {
  constructor(private _fetch: FetchFn) {}

  list(limit = 50, offset = 0): Promise<AuditLogEntry[]> {
    return request(this._fetch, "GET", `/audit-log?limit=${limit}&offset=${offset}`);
  }
}

// ── Main Management Client ────────────────────────────────────────────────────

export class ManagementClient {
  readonly keys: KeysResource;
  readonly policies: PoliciesResource;
  readonly usage: UsageResource;
  readonly billing: BillingResource;
  readonly batch: BatchResource;
  readonly webhooks: WebhooksResource;
  readonly providerKeys: ProviderKeysResource;
  readonly notifications: NotificationsResource;
  readonly providers: ProvidersResource;
  readonly auditLog: AuditLogResource;

  /**
   * @param fetchFn A function that takes (path, init) and makes an authenticated
   *                request to the Routra API. The Routra client provides this.
   */
  constructor(fetchFn: FetchFn) {
    this.keys = new KeysResource(fetchFn);
    this.policies = new PoliciesResource(fetchFn);
    this.usage = new UsageResource(fetchFn);
    this.billing = new BillingResource(fetchFn);
    this.batch = new BatchResource(fetchFn);
    this.webhooks = new WebhooksResource(fetchFn);
    this.providerKeys = new ProviderKeysResource(fetchFn);
    this.notifications = new NotificationsResource(fetchFn);
    this.providers = new ProvidersResource(fetchFn);
    this.auditLog = new AuditLogResource(fetchFn);
  }
}
