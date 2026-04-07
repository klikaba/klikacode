# @opencode-ai/sdk

TypeScript/JavaScript SDK for Klika Code (OpenCode).

## Installation

```bash
npm install @opencode-ai/sdk
# or
bun add @opencode-ai/sdk
```

## Quick Start

### Using the SDK Client

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk/v2"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  directory: "/path/to/project", // Optional: sets x-opencode-directory header
})

// List sessions
const sessions = await client.session.list()

// Get configuration
const config = await client.config.get()

// Subscribe to events
const events = await client.event.subscribe()
for await (const event of events.stream) {
  console.log("Event:", event)
}
```

### Using the Server Helper

```typescript
import { createOpencodeServer } from "@opencode-ai/sdk"

// Start a server instance
const server = await createOpencodeServer({
  port: 4096,
  config: {
    provider: {
      anthropic: {
        options: {
          apiKey: "your-api-key",
        },
      },
    },
  },
})

// Server is now running at server.url
// Use createOpencodeClient from @opencode-ai/sdk/v2 to connect

// Clean up
server.close()
```

### Using the TUI Helper

```typescript
import { createOpencodeTui } from "@opencode-ai/sdk"

// Launch TUI programmatically
const tui = await createOpencodeTui({
  project: "/path/to/project",
  model: "anthropic/claude-sonnet-4-5-20250929",
  agent: "build",
})

// TUI runs until user exits
```

## API Overview

### Client Methods

The SDK provides type-safe access to all Klika Code APIs:

- **Session**: `session.list()`, `session.get()`, `session.create()`, `session.fork()`
- **Message**: `message.list()`, `message.get()`
- **Config**: `config.get()`, `config.update()`
- **Provider**: `provider.list()`, `provider.auth()`
- **Agent**: `agent.list()`, `agent.get()`
- **Tool**: `tool.list()`, `tool.ids()`
- **Event**: `event.subscribe()` - SSE event stream
- **Project**: `project.get()`, `project.sandbox()`
- **VCS**: `vcs.get()` - Git branch info
- **LSP**: `lsp.list()`, `lsp.status()`
- **MCP**: `mcp.list()`, `mcp.status()`

### Event Types

Subscribe to real-time events:

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk/v2"

const client = createOpencodeClient({ baseUrl: "http://localhost:4096" })

const events = await client.event.subscribe()
for await (const event of events.stream) {
  switch (event.type) {
    case "session.created":
      console.log("New session:", event.properties)
      break
    case "permission.asked":
      console.log("Permission request:", event.properties)
      break
    case "session.diff":
      console.log("File changes:", event.properties.diff)
      break
  }
}
```

## Types

All types are exported from the SDK:

```typescript
import type {
  Session,
  Message,
  Part,
  Agent,
  Provider,
  Config,
  PermissionRequest,
  Tool,
} from "@opencode-ai/sdk/v2"
```

## Error Handling

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk/v2"

const client = createOpencodeClient({ baseUrl: "http://localhost:4096" })

try {
  const sessions = await client.session.list()
} catch (error) {
  if (error instanceof Error) {
    console.error("Failed to list sessions:", error.message)
  }
}
```

## Advanced Usage

### Custom Fetch

```typescript
const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  fetch: async (input, init) => {
    // Add custom headers, logging, etc.
    const headers = new Headers(init?.headers)
    headers.set("X-Custom-Header", "value")
    return fetch(input, { ...init, headers })
  },
})
```

### Abort Signals

```typescript
const abort = new AbortController()

const events = await client.event.subscribe({}, { signal: abort.signal })

// Later...
abort.abort()
```

## Development

### Regenerating SDK

When the server API changes (`packages/opencode/src/server/server.ts`):

```bash
# From repo root
./script/generate.ts
```

This:
1. Generates OpenAPI spec from server routes
2. Creates TypeScript types with `@hey-api/openapi-ts`
3. Formats generated code with Prettier

### SDK Structure

```
packages/sdk/js/
├── src/
│   ├── v2/
│   │   ├── gen/        # Generated types and client
│   │   ├── client.ts   # Client wrapper
│   │   ├── server.ts   # Server/TUI helpers
│   │   └── index.ts    # Exports
│   ├── client.ts       # Legacy client
│   ├── server.ts       # Legacy server
│   └── index.ts        # Main exports
├── script/
│   └── build.ts        # SDK generation script
└── openapi.json        # OpenAPI spec (generated)
```

## Versioning

SDK version matches the Klika Code version (e.g., `1.1.18`).

## License

MIT
