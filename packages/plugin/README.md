# @opencode-ai/plugin

Plugin system for Klika Code (OpenCode).

## Overview

Plugins allow you to extend Klika Code with custom functionality:
- Custom authentication providers
- Tool definitions and handlers
- Chat message transformation
- Permission customization
- System prompt modification

## Quick Start

```typescript
// my-plugin.ts
import type { Plugin, PluginInput, Hooks } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin/tool"
import { z } from "zod"

export const myPlugin: Plugin = async (input: PluginInput) => {
  const hooks: Hooks = {
    // Add custom tools
    tool: {
      mytool: tool({
        description: "My custom tool",
        args: {
          input: z.string(),
        },
        execute: async (args, ctx) => {
          return `Processed: ${args.input}`
        },
      }),
    },

    // Listen to events
    event: async ({ event }) => {
      console.log("Event:", event)
    },

    // Modify chat messages before sending to LLM
    "experimental.chat.messages.transform": async (input, output) => {
      // Filter or transform messages
    },

    // Modify system prompt
    "experimental.chat.system.transform": async (input, output) => {
      output.system.push("Custom system instruction")
    },
  }

  return hooks
}
```

## Installation

```bash
npm install @opencode-ai/plugin
```

## Plugin Hooks

### `event`

Called when any event is emitted.

```typescript
event: async ({ event }) => {
  if (event.type === "session.created") {
    console.log("New session:", event.properties)
  }
}
```

### `tool`

Define custom tools available to agents.

```typescript
import { tool } from "@opencode-ai/plugin/tool"
import { z } from "zod"

tool: {
  mytool: tool({
    description: "Does something useful",
    args: {
      param1: z.string(),
    },
    execute: async (args, ctx) => {
      return "Result"
    },
  }),
}
```

### `auth`

Add custom authentication providers.

```typescript
auth: {
  provider: "myprovider",
  loader: async (auth, provider) => {
    const credentials = await auth()
    return { apiKey: credentials.key }
  },
  methods: [
    {
      type: "api",
      label: "My Provider API Key",
      prompts: [
        {
          type: "text",
          key: "apiKey",
          message: "Enter your API key",
        },
      ],
      authorize: async (inputs) => {
        return {
          type: "success",
          key: inputs.apiKey,
        }
      },
    },
  ],
}
```

### `chat.message`

Called when a new user message is received.

```typescript
"chat.message": async (input, output) => {
  // input: { sessionID, agent, model, messageID, variant }
  // output: { message: UserMessage, parts: Part[] }

  // Add file attachments, modify content, etc.
}
```

### `chat.params`

Modify parameters sent to the LLM.

```typescript
"chat.params": async (input, output) => {
  // input: { sessionID, agent, model, provider, message }
  // output: { temperature, topP, topK, options }

  // Adjust temperature based on agent
  if (input.agent === "creative") {
    output.temperature = 0.8
  }
}
```

### `permission.ask`

Customize permission decisions.

```typescript
"permission.ask": async (input, output) => {
  // input: Permission request
  // output: { status: "ask" | "deny" | "allow" }

  // Auto-allow certain patterns
  if (input.permission === "read" && input.patterns.includes("*.md")) {
    output.status = "allow"
  }
}
```

### `tool.execute.before`

Called before tool execution.

```typescript
"tool.execute.before": async (input, output) => {
  // input: { tool, sessionID, callID }
  // output: { args }

  // Validate or modify arguments
}
```

### `tool.execute.after`

Called after tool execution.

```typescript
"tool.execute.after": async (input, output) => {
  // input: { tool, sessionID, callID }
  // output: { title, output, metadata }

  // Transform output, add metadata, etc.
}
```

### `experimental.chat.messages.transform`

Transform messages before sending to LLM.

```typescript
"experimental.chat.messages.transform": async (input, output) => {
  // output: { messages: { info: Message, parts: Part[] }[] }

  // Filter sensitive messages, add context, etc.
}
```

### `experimental.chat.system.transform`

Modify system prompt.

```typescript
"experimental.chat.system.transform": async (input, output) => {
  // output: { system: string[] }

  output.system.push("Additional instruction")
}
```

### `experimental.session.compacting`

Customize compaction behavior.

```typescript
"experimental.session.compacting": async (input, output) => {
  // output: { context: string[], prompt?: string }

  output.context.push("Remember to mention recent changes")
}
```

### `experimental.text.complete`

Complete text responses.

```typescript
"experimental.text.complete": async (input, output) => {
  // output: { text: string }

  // Post-process generated text
}
```

## Plugin Input

Your plugin receives a `PluginInput` object:

```typescript
{
  client: OpencodeClient,      // API client for server calls
  project: Project,            // Current project info
  directory: string,           // Working directory
  worktree: string,            // Git worktree root
  serverUrl: URL,              // Server URL
  $: BunShell                  // Shell execution
}
```

## Using the Plugin

Add to your `opencode.jsonc`:

```jsonc
{
  "plugin": ["file:///path/to/my-plugin.ts"],
}
```

Or install from npm:

```jsonc
{
  "plugin": ["my-npm-plugin@1.0.0"],
}
```

## Built-in Plugins

These plugins are automatically loaded:
- `opencode-copilot-auth` - GitHub Copilot authentication
- `opencode-anthropic-auth` - Anthropic OAuth
- `@gitlab/opencode-gitlab-auth` - GitLab authentication

Disable with `OPENCODE_DISABLE_DEFAULT_PLUGINS=1`.

## Example: Custom Tool Plugin

```typescript
import type { Plugin, PluginInput, Hooks } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin/tool"
import { z } from "zod"

export const weatherPlugin: Plugin = async (input) => {
  const hooks: Hooks = {
    tool: {
      weather: tool({
        description: "Get weather for a location",
        args: {
          location: z.string().describe("City name"),
        },
        execute: async (args) => {
          const response = await fetch(
            `https://api.weather.com/${args.location}`,
          )
          const data = await response.json()

          return `Weather in ${args.location}: ${data.temp}°C, ${data.condition}`
        },
      }),
    },
  }

  return hooks
}
```

## Example: Authentication Plugin

```typescript
import type { Plugin, Hooks } from "@opencode-ai/plugin"

export const customAuthPlugin: Plugin = async () => {
  const hooks: Hooks = {
    auth: {
      provider: "custom",
      methods: [
        {
          type: "api",
          label: "Custom API Key",
          prompts: [
            {
              type: "text",
              key: "apiKey",
              message: "Enter your Custom API key",
              validate: (value) => {
                if (value.length < 10) return "Key must be at least 10 characters"
              },
            },
          ],
          authorize: async (inputs) => {
            // Validate with your API
            const valid = await validateKey(inputs.apiKey)
            if (valid) {
              return {
                type: "success",
                key: inputs.apiKey,
              }
            }
            return { type: "failed" }
          },
        },
      ],
    },
  }

  return hooks
}
```

## Best Practices

1. **Error Handling**: Always handle errors gracefully
2. **Logging**: Use `console.log` for debugging
3. **Performance**: Keep hooks async and non-blocking
4. **Security**: Never expose API keys in output
5. **Testing**: Test plugins in isolation before integration

## Development

```bash
# Create plugin
mkdir my-plugin && cd my-plugin
npm init -y
npm install @opencode-ai/plugin zod

# Create index.ts
cat > index.ts << 'EOF'
import type { Plugin } from "@opencode-ai/plugin"

export const myPlugin: Plugin = async (input) => {
  return {
    tool: {
      // Your tools here
    },
  }
}
EOF

# Build (if using TypeScript)
npx tsc

# Test in opencode.jsonc
{
  "plugin": ["file:///path/to/my-plugin/dist/index.js"]
}
```

## Publishing

```bash
# Package.json should have:
{
  "name": "my-opencode-plugin",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}

# Publish to npm
npm publish
```

## Troubleshooting

### Plugin not loading

- Check path is absolute: `file:///full/path/to/plugin.ts`
- Ensure file exists and is valid TypeScript/JavaScript
- Check for syntax errors in plugin code

### Tool not appearing

- Verify tool is exported in `hooks.tool`
- Check tool name is unique
- Restart Klika Code after adding plugin

### Auth not working

- Ensure `provider` matches the plugin name
- Check `authorize` returns correct format
- Verify credentials are stored in `~/.local/share/opencode/auth.json`

## License

MIT
