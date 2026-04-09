# Routra TypeScript SDK

Thin wrapper over the [OpenAI TypeScript SDK](https://github.com/openai/openai-node). Adds typed routing metadata and policy helpers with full TypeScript type safety.

## Installation

```bash
npm install routra-sdk
# or
bun add routra-sdk
```

## Quick Start

```typescript
import { Routra } from "routra-sdk";

const client = new Routra({ apiKey: "rtr-..." });

const response = await client.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "Hello" }],
});

// Typed routing metadata on every non-streaming response
console.log(response.routra?.provider);    // "groq"
console.log(response.routra?.latency_ms);  // 245
console.log(response.routra?.score);       // 0.8642
console.log(response.routra?.cost_usd);    // 0.000089
```

## Typed Completion Helper

Use the `completion()` method for non-streaming requests with full `RoutraCompletion` typing:

```typescript
const response = await client.completion({
  model: "auto",
  messages: [{ role: "user", content: "Hello" }],
});

// response.routra is fully typed
if (response.routra) {
  console.log(response.routra.provider);
  console.log(response.routra.failover);
}
```

## Routing Policies

```typescript
// Set a default policy for all requests
const client = new Routra({ apiKey: "rtr-...", policy: "cheapest" });

// Per-request policy override
const fastClient = client.withPolicy("fastest");
const response = await fastClient.completion({
  model: "auto",
  messages: [{ role: "user", content: "Urgent request" }],
});
```

## Routing Metadata

The `response.routra` field is a `RoutingMetadata` object:

| Field | Type | Description |
|-------|------|-------------|
| `provider` | `string` | Provider slug that served the request |
| `latency_ms` | `number` | Total provider response time in milliseconds |
| `score` | `number` | Normalized routing score (0–1) |
| `cost_usd` | `number?` | Estimated cost in USD |
| `input_tokens` | `number?` | Input token count |
| `output_tokens` | `number?` | Output token count |
| `failover` | `boolean?` | Whether the request was rerouted due to a provider failure |
| `ttfb_ms` | `number?` | Time to first byte (streaming only) |

> **Note:** Metadata is only available on non-streaming responses. For streaming, check the `x-routra-provider` response header.

## OpenAI Compatibility

Since `Routra` extends `OpenAI`, all OpenAI SDK features work transparently:

```typescript
// Streaming
const stream = await client.chat.completions.create({
  model: "auto",
  messages: [{ role: "user", content: "Count to 10" }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}

// Embeddings
const embedding = await client.embeddings.create({
  model: "text-embedding-3-small",
  input: "Hello world",
});
```

## Exports

```typescript
import { Routra } from "routra-sdk";
import type { RoutraOptions, RoutingMetadata, RoutraCompletion } from "routra-sdk";
```

## License

MIT
