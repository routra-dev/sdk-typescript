import type OpenAI from "openai";

/** Routing metadata injected by Routra on every non-streaming completion response. */
export interface RoutingMetadata {
  provider: string;
  latency_ms: number;
  score: number;
  cost_usd?: number;
  input_tokens?: number;
  output_tokens?: number;
  failover?: boolean;
  ttfb_ms?: number;
}

/** ChatCompletion response augmented with Routra routing metadata. */
export type RoutraCompletion = OpenAI.Chat.ChatCompletion & {
  routra?: RoutingMetadata;
};
