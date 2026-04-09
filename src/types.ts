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

/**
 * Augment the OpenAI SDK so `ChatCompletion` always carries the optional
 * `.routra` field injected by the Routra proxy.
 */
declare module "openai" {
  interface ChatCompletion {
    routra?: RoutingMetadata;
  }
}

/** Convenience alias — `ChatCompletion` now includes `.routra` via module augmentation. */
export type RoutraCompletion = OpenAI.Chat.ChatCompletion;

// Required to keep this file as a module (needed for declaration merging above).
export {};
