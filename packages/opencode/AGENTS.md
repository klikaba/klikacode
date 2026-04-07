# opencode agent guidelines

## Build/Test Commands

- **Install**: `bun install` (from repo root)
- **Run**: `bun dev` or `bun run --conditions=browser ./src/index.ts`
- **Typecheck**: `bun run typecheck` (from repo root, uses turbo)
- **Test**: `bun test` (runs all tests)
- **Single test**: `bun test test/tool/bash.test.ts` (specific test file)
- **Build**: `./script/build.ts --single` (creates standalone binary)

## Code Style

- **Runtime**: Bun with TypeScript ESM modules
- **Imports**: Use relative imports for local modules, named imports preferred
- **Types**: Zod schemas for validation, TypeScript interfaces for structure
- **Naming**: camelCase for variables/functions, PascalCase for classes/namespaces
- **Error handling**: Use Result patterns, avoid throwing exceptions in tools
- **File structure**: Namespace-based organization (e.g., `Tool.define()`, `Session.create()`)
- **Style guide**: Follow [../../STYLE_GUIDE.md](../../STYLE_GUIDE.md) - no `let`, no `else`, single-word names

## Architecture

- **Tools**: Implement `Tool.Info` interface with `execute()` method
- **Context**: Pass `sessionID` in tool context, use `Instance.provide()` for DI
- **Validation**: All inputs validated with Zod schemas
- **Logging**: Use `Log.create({ service: "name" })` pattern
- **Storage**: Use `Storage` namespace for persistence
- **State**: Use `Instance.state()` for directory-scoped singletons
- **Events**: Use `Bus.publish()` and `BusEvent.define()` for typed events
- **Permissions**: Use `PermissionNext` for pattern-based permission checks

## SDK Generation

When adding/modifying server endpoints in `src/server/server.ts`:

```bash
./script/generate.ts
```

This regenerates:
- `packages/sdk/openapi.json` - OpenAPI spec
- `packages/sdk/js/src/v2/gen/` - TypeScript client types
- `packages/docs/openapi.json` - Documentation OpenAPI spec

## Key Directories

- `src/cli/cmd/tui/` - Terminal UI (SolidJS + opentui)
- `src/server/` - Hono server routes
- `src/session/` - Session management and LLM streaming
- `src/tool/` - Built-in tool implementations
- `src/agent/` - Agent definitions and system prompts
- `src/mcp/` - Model Context Protocol integration
- `src/lsp/` - Language Server Protocol integration
- `src/permission/` - Permission system

## Testing Guidelines

- Run tests from `packages/opencode` directory
- Use `bun test` for running tests
- Mock external dependencies (LSP, MCP, providers)
- Test tool execution with sample inputs
- Example: `bun test test/tool/bash.test.ts`
