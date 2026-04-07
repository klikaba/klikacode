# Klika Code App

Shared web UI components for Klika Code, built with SolidJS.

## Usage

This package provides the core UI components used by:
- `packages/web` - Web application
- `packages/desktop` - Desktop app (via Tauri)

## Development

```bash
# From repo root
bun run --cwd packages/app dev
```

Starts Vite dev server at http://localhost:5173

Most UI changes can be tested here without launching the full TUI or desktop app.

## Build

```bash
bun run --cwd packages/app build
```

Outputs to `packages/app/dist/`

## Architecture

- **Framework**: SolidJS 1.9+
- **Styling**: Tailwind CSS 4
- **Routing**: Solid Router
- **State**: Solid stores and contexts
- **Build**: Vite

## Key Components

- `components/` - Reusable UI components
- `pages/` - Route pages
- `context/` - Reactivity contexts
- `hooks/` - SolidJS hooks
- `utils/` - Helper functions

## Integration

Components from this package are imported into:
- `packages/web/src/` - Web app entry point
- `packages/desktop/src/` - Desktop app wrapper

## Styling

Uses Tailwind CSS 4 via Vite plugin.

## Testing UI Changes

1. Make changes in `packages/app/src/`
2. Run `bun run --cwd packages/app dev`
3. View at http://localhost:5173
4. Changes hot-reload automatically

## Deployment

The `dist/` folder can be deployed to any static host:
- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
