# Electron → Tauri Migration Design

**Date:** 2026-03-25  
**Project:** ai-ssh-assistant-tauri (new repo)  
**Goal:** Reduce bundle size (~150MB → ~8-12MB), improve memory usage and
startup speed

## Architecture

### Hybrid Architecture: Tauri + Node.js Sidecar

```
┌─────────────────────────────────────────────────────────────┐
│                    Tauri (Rust)                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Window    │  │   System     │  │   WebSocket     │  │
│  │   Manager   │  │   Tray/Menu  │  │   Server       │  │
│  └─────────────┘  └──────────────┘  └────────┬────────┘  │
│                                               │            │
└───────────────────────────────────────────────┼────────────┘
                                                │ WebSocket
┌───────────────────────────────────────────────┼────────────┐
│                    Node.js Sidecar             │            │
│  ┌─────────────┐  ┌──────────────┐  ┌───────▼────────┐   │
│  │   ssh2      │  │  better-    │  │   Business     │   │
│  │   Manager   │  │  sqlite3    │  │   Logic        │   │
│  └─────────────┘  └──────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Module Mapping

| Feature           | Electron (Current)           | Tauri (Target)           |
| ----------------- | ---------------------------- | ------------------------ |
| Window Management | BrowserWindow                | Tauri WebviewWindow      |
| IPC               | ipcMain/ipcRenderer          | WebSocket                |
| SSH Connection    | ssh2 (Node.js)               | ssh2 (Node Sidecar)      |
| Database          | better-sqlite3               | better-sqlite3 (Sidecar) |
| AI Calls          | Renderer direct / Main proxy | Node Sidecar proxy       |
| System Tray       | Electron Tray                | Tauri Tray               |
| File Dialogs      | Electron dialog              | Tauri dialog plugin      |
| App Metadata      | electron-builder             | Tauri bundler            |

## IPC Communication

**Protocol:** WebSocket (JSON-RPC style)

### Channels

| Channel        | Direction          | Purpose             |
| -------------- | ------------------ | ------------------- |
| `ssh:connect`  | Renderer → Sidecar | Connect SSH         |
| `ssh:output:*` | Sidecar → Renderer | SSH stream output   |
| `ssh:execute`  | Renderer → Sidecar | Execute command     |
| `storage:*`    | Renderer → Sidecar | Database operations |
| `ai:*`         | Renderer → Sidecar | AI API calls        |

## Key Decisions

1. **WebSocket IPC** - Supports bidirectional streaming needed for SSH
2. **Node Sidecar** - Maximizes code reuse (ssh2, better-sqlite3, native
   modules)
3. **Three-platform sync** - Windows/macOS/Linux simultaneously
4. **Keep native modules** - No Rust rewrites initially

## File Structure

```
src-tauri/           # Rust backend
  ├── src/
  │   ├── main.rs          # Entry point
  │   ├── commands/        # Tauri commands
  │   └── lib.rs
  ├── Cargo.toml
  └── tauri.conf.json

node-sidecar/        # Node.js backend
  ├── src/
  │   ├── index.ts          # Entry point
  │   ├── ssh-manager.ts    # SSH logic (from current electron/)
  │   ├── ws-server.ts      # WebSocket server
  │   └── services/         # Other services
  ├── package.json
  └── tsconfig.json

src/                 # Vue 3 frontend (from current apps/desktop)
apps/desktop/        # → src/
electron/            # → node-sidecar/
```

## Build Configuration

| Platform | Output             |
| -------- | ------------------ |
| Windows  | .exe / .msi (NSIS) |
| macOS    | .dmg / .app        |
| Linux    | .deb / .AppImage   |

## Expected Improvements

| Metric                | Electron | Tauri   |
| --------------------- | -------- | ------- |
| Bundle size (Windows) | ~150MB   | ~8-12MB |
| Memory usage          | High     | Low     |
| Startup time          | Slow     | Fast    |
| Native feel           | Good     | Better  |

## Implementation Order

1. Setup Tauri project structure
2. Setup Node sidecar with WebSocket server
3. Migrate SSH handlers (reuse from electron/)
4. Migrate storage handlers (reuse from electron/)
5. Migrate AI handlers
6. Setup WebView with Vue 3 frontend
7. Add system tray and menus
8. Configure multi-platform builds
9. Test and polish
