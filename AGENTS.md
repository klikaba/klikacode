# Klika Code Agent Guidelines

## Quick Commands

- **Test opencode**: `bun dev` (runs in `packages/opencode` by default)
- **Test against specific directory**: `bun dev <directory>`
- **Regenerate JavaScript SDK**: `./script/generate.ts`
- **Build standalone binary**: `./packages/opencode/script/build.ts --single`
- **Run web app**: `bun run --cwd packages/app dev`
- **Run desktop app**: `bun run --cwd packages/desktop tauri dev`

## Development Guidelines

- **ALWAYS USE PARALLEL TOOLS** when applicable (multiple independent file operations, searches, etc.)
- **Default branch**: `dev` (not `main`)
- **Package manager**: Bun 1.3+
- **Type checking**: `bun run typecheck` (uses turbo from repo root)

## Architecture Overview

- **Monorepo**: Bun workspaces with Turborepo
- **CLI**: `packages/opencode` - Core business logic and TUI
- **Web UI**: `packages/app` - Shared SolidJS components
- **Desktop**: `packages/desktop` - Tauri wrapper
- **SDK**: `packages/sdk/js` - TypeScript/JavaScript SDK
- **Plugin**: `packages/plugin` - Plugin system

## Code Style

Follow [STYLE_GUIDE.md](./STYLE_GUIDE.md):
- No `let` statements (use `const` with ternary)
- No `else` statements (prefer early returns)
- Single-word variable names when possible
- Avoid unnecessary destructuring
- Use Bun APIs (`Bun.file()`, `Bun.$`)
- Prefer `.catch()` over `try/catch`

## Testing

- Tests are in `packages/opencode/test/`
- Run from package directory: `bun test`
- Specific test: `bun test test/tool/bash.test.ts`

## Documentation

- Main docs: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Style guide: [STYLE_GUIDE.md](./STYLE_GUIDE.md)
- Package docs: `packages/*/README.md` or `packages/*/AGENTS.md`
