# Klika Code (opencode)

AI-powered coding agent that runs in your terminal.

## Quick Start

```bash
# Run development server
bun dev

# Run against a specific directory
bun dev <directory>

# Type check
bun run typecheck

# Run tests
bun test
```

## Building

To compile a standalone executable:

```bash
./script/build.ts --single
```

This creates platform-specific binaries in `dist/`.

## Architecture

- **CLI**: `src/index.ts` - Main entry point with yargs command handling
- **Server**: `src/server/server.ts` - Hono-based HTTP/WebSocket server
- **TUI**: `src/cli/cmd/tui/` - SolidJS terminal UI with opentui
- **Tools**: `src/tool/` - Built-in tools (edit, bash, read, write, etc.)
- **Agents**: `src/agent/` - Agent definitions and prompts
- **Session**: `src/session/` - Session management and LLM streaming

See root [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed development guide.
