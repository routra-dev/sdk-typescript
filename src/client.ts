import OpenAI, { type ClientOptions } from "openai";

const BASE_URL = "https://api.routra.dev/v1";

export interface RoutraOptions extends Omit<ClientOptions, "baseURL"> {
  /** Routra API key (rtr-...) */
  apiKey: string;
  /** Default routing policy name — sets X-Routra-Policy header on every request */
  policy?: string;
  /** Override API base URL (useful for local dev / testing) */
  baseURL?: string;
}

/**
 * Routra client. Drop-in replacement for `new OpenAI(...)`.
 *
 * Layer 1: point `baseURL` at Routra — all models route automatically.
 * Layer 2: set a `policy` to apply routing constraints (cheapest, balanced, gdpr-eu, ...).
 *
 * @example
 * ```ts
 * import { Routra } from "routra";
 *
 * const client = new Routra({ apiKey: "rtr-...", policy: "cheapest" });
 * const resp = await client.chat.completions.create({
 *   model: "auto",
 *   messages: [{ role: "user", content: "Hello" }],
 * });
 * console.log(resp.routra?.provider, resp.routra?.cost_usd);
 * ```
 */
export class Routra extends OpenAI {
  constructor({ apiKey, policy, baseURL = BASE_URL, ...rest }: RoutraOptions) {
    const defaultHeaders: Record<string, string> = {
      ...(rest.defaultHeaders as Record<string, string> | undefined),
    };
    if (policy) {
      defaultHeaders["X-Routra-Policy"] = policy;
    }

    super({
      apiKey,
      baseURL,
      defaultHeaders,
      ...rest,
    });
  }

  /**
   * Return a new client instance with the given policy applied.
   * Useful for request-scoped policy overrides without mutating the base client.
   */
  withPolicy(policy: string): Routra {
    return new Routra({
      apiKey: this.apiKey,
      baseURL: this.baseURL.toString(),
      policy,
    });
  }
}
