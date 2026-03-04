# Klika Code Desktop

Native Klika Code desktop app, built with Tauri v2.

## Quick Start

```bash
# From repo root
bun install
bun run --cwd packages/desktop tauri dev
```

This starts:
1. Vite dev server on http://localhost:1420
2. Native Tauri window with the app

## Development

### Web-only mode (no native window)

```bash
bun run --cwd packages/desktop dev
```

Useful for testing UI changes without launching the native shell.

### Build for Production

```bash
bun run --cwd packages/desktop tauri build
```

Creates platform-specific bundles in `packages/desktop/src-tauri/target/release/bundle/`:
- macOS: `.dmg` and `.app`
- Windows: `.exe` and `.msi`
- Linux: `.deb`, `.rpm`, and `.AppImage`

## Architecture

- **Frontend**: SolidJS (wraps `packages/app`)
- **Backend**: Rust + Tauri v2
- **IPC**: Tauri commands for native functionality

## Prerequisites

Requires Tauri development dependencies:

- Rust toolchain (`rustup`)
- Platform-specific libraries (see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/))

### macOS

```bash
xcode-select --install
```

### Windows

Install [Build Tools for Visual Studio](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with C++ workload.

### Linux

```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

## Debugging

- **Frontend**: DevTools available in dev mode (right-click → Inspect)
- **Backend**: Use `console.log()` in Rust or attach debugger to `src-tauri` process

## Configuration

Tauri config: `packages/desktop/src-tauri/tauri.conf.json`

Key settings:
- `identifier`: App bundle ID
- `windows`: Window size, title, etc.
- `bundle`: Icon, category, targets

## Troubleshooting

### "Tauri not found"

Ensure you're running from repo root with dependencies installed.

### Build fails on Linux

Install required dependencies (see Prerequisites above).

### Window is blank

Check Vite dev server is running on port 1420.
