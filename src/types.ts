import type OpenAI from "openai";

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
export type RoutraCompletion = OpenAI.Chat.ChatCompletion & {
  routra?: RoutingMetadata;
};
