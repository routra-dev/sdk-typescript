import type OpenAI from "openai";

/** Routing metadata injected by Routra on every non-streaming response. */
export interface RoutingMetadata {
  provider: string;
  latency_ms: number;
  score: number;
  cost_usd?: number;
  /** Token-based responses (chat, embeddings) */
  input_tokens?: number;
  output_tokens?: number;
  /** Non-token responses (images, audio) */
  usage_unit?: string;
  usage_value?: number;
  failover?: boolean;
  ttfb_ms?: number;
}

/**
 * Augment the OpenAI SDK so all proxy response types carry the optional
 * `.routra` field injected by the Routra proxy.
 */
declare module "openai/resources/chat/completions" {
  interface ChatCompletion {
    routra?: RoutingMetadata;
  }
}

declare module "openai/resources/embeddings" {
  interface CreateEmbeddingResponse {
    routra?: RoutingMetadata;
  }
}

declare module "openai/resources/images" {
  interface ImagesResponse {
    routra?: RoutingMetadata;
  }
}

declare module "openai/resources/audio/transcriptions" {
  interface Transcription {
    routra?: RoutingMetadata;
  }
}

/** Convenience alias — `ChatCompletion` now includes `.routra` via module augmentation. */
export type RoutraCompletion = OpenAI.Chat.ChatCompletion;

/** Convenience alias — `ImagesResponse` now includes `.routra` via module augmentation. */
export type RoutraImagesResponse = OpenAI.Images.ImagesResponse;

/** Convenience alias — `CreateEmbeddingResponse` now includes `.routra` via module augmentation. */
export type RoutraEmbeddingResponse = OpenAI.Embeddings.CreateEmbeddingResponse;

// Required to keep this file as a module (needed for declaration merging above).
export {};
