export interface RoutingMetadata {
  provider: string;
  latency_ms: number;
  cost_usd: number;
  input_tokens: number;
  output_tokens: number;
  score_selected: number;
  failover: boolean;
  ttfb_ms?: number;
}

/** ChatCompletion response augmented with Routra routing metadata */
export interface RoutraCompletion<T = unknown> extends Record<string, unknown> {
  routra?: RoutingMetadata;
  _raw: T;
}
