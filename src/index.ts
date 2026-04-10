/**
 * Routra TypeScript SDK
 *
 * Thin wrapper over the OpenAI TypeScript SDK.
 * Adds typed routing metadata, policy helpers, and management namespaces.
 *
 * @module routra
 */

export { Routra } from "./client.js";
export type { RoutraOptions } from "./client.js";
export type { RoutingMetadata, RoutraCompletion, RoutraImagesResponse, RoutraEmbeddingResponse } from "./types.js";
export { ManagementClient } from "./management/index.js";
export type * from "./management/types.js";

// Re-export OpenAI error types so callers can catch and discriminate errors
// without adding `openai` as a direct dependency.
//
// Usage:
//   import { Routra, APIError, BadRequestError } from "routra";
//   try {
//     const resp = await client.chat.completions.create({ ... });
//   } catch (e) {
//     if (e instanceof BadRequestError) { ... }   // 400 - invalid params
//     if (e instanceof APIError) { console.error(e.status, e.message); }
//   }
export {
  APIError,
  APIConnectionError,
  APIConnectionTimeoutError,
  AuthenticationError,
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  PermissionDeniedError,
  RateLimitError,
  UnprocessableEntityError,
} from "openai";
