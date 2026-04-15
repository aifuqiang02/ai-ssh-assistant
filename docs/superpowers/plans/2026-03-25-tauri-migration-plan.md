# Tauri Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate ai-ssh-assistant from Electron to Tauri, reducing bundle size
from ~150MB to ~8-12MB

**Architecture:** Hybrid approach - Tauri (Rust) for window management + Node.js
sidecar for SSH/database/AI business logic, connected via WebSocket

**Tech Stack:** Tauri 2.x, Rust, Node.js 20+, Vue 3, ssh2, better-sqlite3,
WebSocket

---

## Project Structure

```
ai-ssh-assistant-tauri/
├── src-tauri/              # Rust backend (Tauri)
├── node-sidecar/           # Node.js business logic
├── src/                    # Vue 3 frontend
└── ...
```

---

## Phase 1: Project Scaffolding

### Task 1: Initialize Tauri Project

**Files:**

- Create: `src-tauri/Cargo.toml`
- Create: `src-tauri/tauri.conf.json`
- Create: `src-tauri/src/main.rs`
- Create: `src-tauri/src/lib.rs`
- Create: `node-sidecar/package.json`
- Create: `node-sidecar/tsconfig.json`

- [ ] **Step 1: Create Tauri 2.x project structure**

```toml
# src-tauri/Cargo.toml
[package]
name = "ai-ssh-assistant"
version = "1.0.0"
edition = "2021"

[lib]
name = "ai_ssh_assistant_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = ["tray-icon"] }
tauri-plugin-shell = "2"
tauri-plugin-dialog = "2"
tauri-plugin-fs = "2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
log = "0.4"
env_logger = "0.11"
```

```json
// src-tauri/tauri.conf.json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "AI SSH Assistant",
  "version": "1.0.0",
  "identifier": "com.ai-ssh-assistant.desktop",
  "build": {
    "devtools": true,
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "AI SSH Assistant",
        "width": 1450,
        "height": 900,
        "minWidth": 800,
        "minHeight": 600,
        "resizable": true,
        "decorations": true
      }
    ],
    "trayIcon": {
      "iconPath": "icons/icon.png",
      "iconAsTemplate": true
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": ["icons/icon.ico", "icons/icon.png"]
  }
}
```

```rust
// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    ai_ssh_assistant_lib::run()
}
```

```rust
// src-tauri/src/lib.rs
use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    env_logger::init();
    log::info!("Starting AI SSH Assistant");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            log::info!("App setup complete");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

- [ ] **Step 2: Create Node sidecar package.json**

```json
{
  "name": "@ai-ssh/sidecar",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "ssh2": "^1.17.0",
    "better-sqlite3": "^12.4.1",
    "ws": "^8.16.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.13",
    "@types/ssh2": "^1.11.0",
    "@types/ws": "^8.5.10",
    "tsx": "^4.6.0",
    "typescript": "~5.3.0"
  }
}
```

- [ ] **Step 3: Create tsconfig.json for sidecar**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: scaffold Tauri + Node sidecar project structure"
```

---

### Task 2: Setup WebSocket Server in Node Sidecar

**Files:**

- Create: `node-sidecar/src/ws-server.ts`
- Create: `node-sidecar/src/index.ts`
- Modify: `node-sidecar/package.json` (add ws dependency)

- [ ] **Step 1: Create WebSocket server with JSON-RPC style messaging**

```typescript
// node-sidecar/src/ws-server.ts
import { WebSocketServer, WebSocket } from 'ws'

interface JsonRpcMessage {
  jsonrpc: '2.0'
  id?: string | number
  method: string
  params?: any
}

interface JsonRpcResponse {
  jsonrpc: '2.0'
  id?: string | number
  result?: any
  error?: { code: number; message: string; data?: any }
}

type MessageHandler = (params: any) => Promise<any>

export class WsServer {
  private wss: WebSocketServer
  private handlers: Map<string, MessageHandler> = new Map()
  private clients: Set<WebSocket> = new Set()

  constructor(port: number = 3001) {
    this.wss = new WebSocketServer({ port })
    this.wss.on('connection', ws => this.onConnection(ws))
    console.log(`[WsServer] WebSocket server started on port ${port}`)
  }

  private onConnection(ws: WebSocket) {
    this.clients.add(ws)
    console.log(`[WsServer] Client connected. Total: ${this.clients.size}`)

    ws.on('message', data => this.handleMessage(ws, data))
    ws.on('close', () => {
      this.clients.delete(ws)
      console.log(`[WsServer] Client disconnected. Total: ${this.clients.size}`)
    })
    ws.on('error', err => {
      console.error('[WsServer] WebSocket error:', err)
      this.clients.delete(ws)
    })
  }

  private async handleMessage(ws: WebSocket, data: any) {
    try {
      const msg: JsonRpcMessage = JSON.parse(data.toString())
      const handler = this.handlers.get(msg.method)

      if (!handler) {
        this.send(ws, {
          jsonrpc: '2.0',
          id: msg.id,
          error: { code: -32601, message: `Method not found: ${msg.method}` }
        })
        return
      }

      const result = await handler(msg.params || {})
      this.send(ws, { jsonrpc: '2.0', id: msg.id, result })
    } catch (err: any) {
      console.error('[WsServer] Error handling message:', err)
      this.send(ws, {
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal error', data: err.message }
      })
    }
  }

  private send(ws: WebSocket, msg: JsonRpcResponse) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg))
    }
  }

  registerHandler(method: string, handler: MessageHandler) {
    this.handlers.set(method, handler)
    console.log(`[WsServer] Registered handler: ${method}`)
  }

  sendToClient(channel: string, data: any) {
    const msg = JSON.stringify({ channel, ...data })
    this.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(msg)
      }
    })
  }
}
```

- [ ] **Step 2: Create sidecar entry point**

```typescript
// node-sidecar/src/index.ts
import { WsServer } from './ws-server.js'
import { SSHManager } from './ssh-manager.js'

const wsServer = new WsServer(3001)
const sshManager = new SSHManager()

// Register SSH handlers
wsServer.registerHandler('ssh:connect', async params => {
  return await sshManager.connect(params)
})

wsServer.registerHandler('ssh:disconnect', async params => {
  return await sshManager.disconnect(params.id)
})

wsServer.registerHandler('ssh:execute', async params => {
  return await sshManager.execute(params.id, params.command)
})

wsServer.registerHandler('ssh:write', async params => {
  return await sshManager.write(params.id, params.data)
})

console.log('[Sidecar] Node sidecar started')
```

- [ ] **Step 3: Create stub SSH manager (will be replaced with actual logic
      later)**

```typescript
// node-sidecar/src/ssh-manager.ts
export class SSHManager {
  async connect(config: any): Promise<any> {
    throw new Error('Not implemented')
  }

  async disconnect(id: string): Promise<void> {
    throw new Error('Not implemented')
  }

  async execute(id: string, command: string): Promise<any> {
    throw new Error('Not implemented')
  }

  async write(id: string, data: string): Promise<void> {
    throw new Error('Not implemented')
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add WebSocket server in Node sidecar"
```

---

## Phase 2: SSH Handler Migration

### Task 3: Migrate SSH Manager to Node Sidecar

**Files:**

- Create: `node-sidecar/src/ssh-manager.ts` (full implementation)
- Modify: `node-sidecar/src/index.ts`

- [ ] **Step 1: Copy and adapt SSH manager from electron/ipc/ssh-handlers.ts**

The actual implementation will be migrated from
`apps/desktop/electron/ipc/ssh-handlers.ts` (lines 28-1011).

Key adaptations needed:

- Replace `ipcMain.handle` calls with WebSocket handlers
- Replace `windowEvents.sendToRenderer` with `wsServer.sendToClient`
- Keep ssh2, better-sqlite3 usage unchanged

```typescript
// node-sidecar/src/ssh-manager.ts
import { Client, SFTPWrapper } from 'ssh2'
import fs from 'fs/promises'
import path from 'path'

interface SSHConnection {
  id: string
  name: string
  host: string
  port: number
  username: string
  password?: string
  privateKey?: string
  passphrase?: string
  authType?: 'password' | 'privateKey' | 'agent'
  client?: Client
  shell?: any
  sftp?: SFTPWrapper
  isConnected: boolean
  lastUsed: Date
  initialOutputBuffer?: string[]
  isInitialOutputClaimed?: boolean
}

export class SSHManager {
  private connections: Map<string, SSHConnection> = new Map()
  private configPath: string
  private wsServer: any // Will be injected

  constructor(wsServer?: any) {
    this.wsServer = wsServer
    this.configPath = path.join(
      process.env.HOME || process.env.USERPROFILE || '',
      '.ai-ssh-assistant',
      'connections.json'
    )
    this.loadConnections()
  }

  setWsServer(wsServer: any) {
    this.wsServer = wsServer
  }

  async connect(config) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 77-198
    // Replace windowEvents.sendToRenderer with wsServer.sendToClient
    // Keep all ssh2.Client logic, connection management, shell handling
  }

  async disconnect(id: string) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 215-255
  }

  async execute(id: string, command: string) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 257-513
    // Keep command output parsing, prompt detection, timeout handling
  }

  async write(id: string, data: string) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 519-549
  }

  async resize(id: string, cols: number, rows: number) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 200-213
  }

  async executeSilent(id: string, command: string) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 555-631
  }

  async listFiles(id: string, remotePath: string) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 779-807
  }

  async uploadFile(id: string, localPath: string, remotePath: string) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 810-871
  }

  async downloadFile(id: string, remotePath: string, localPath: string) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 874-935
  }

  async deleteFile(id: string, remotePath: string, isDirectory: boolean) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 938-957
  }

  async createDirectory(id: string, remotePath: string) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 998-1010
  }

  async testConnection(config) {
    // Adapted from apps/desktop/electron/ipc/ssh-handlers.ts lines 689-751
  }
}
```

- [ ] **Step 2: Test WebSocket communication**

Start sidecar and verify it can receive/send messages.

Run: `cd node-sidecar && pnpm dev`

Expected: Server starts on port 3001

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: migrate SSH manager to node sidecar"
```

---

## Phase 3: Storage Handler Migration

### Task 4: Migrate Storage/Database to Node Sidecar

**Files:**

- Create: `node-sidecar/src/services/storage.ts`
- Modify: `node-sidecar/src/index.ts`

- [ ] **Step 1: Create storage service wrapper**

```typescript
// node-sidecar/src/services/storage.ts
import Database from 'better-sqlite3'
import path from 'path'

export class StorageService {
  private db: Database.Database | null = null

  async connect(userDataPath: string) {
    const dbPath = path.join(userDataPath, 'local.db')
    this.db = new Database(dbPath)
    console.log('[Storage] Connected to SQLite at', dbPath)
  }

  async getConnections() {
    if (!this.db) throw new Error('Database not connected')
    // Query from connections table
    const stmt = this.db.prepare('SELECT * FROM connections')
    return stmt.all()
  }

  async saveConnection(config: any) {
    if (!this.db) throw new Error('Database not connected')
    const stmt = this.db.prepare(`
      INSERT INTO connections (id, name, host, port, username, authType, password, privateKey)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      Date.now().toString(),
      config.name,
      config.host,
      config.port,
      config.username,
      config.authType,
      config.password || null,
      config.privateKey || null
    )
  }

  async disconnect() {
    this.db?.close()
    this.db = null
  }

  async deleteConnection(id: string) {
    if (!this.db) throw new Error('Database not connected')
    const stmt = this.db.prepare('DELETE FROM connections WHERE id = ?')
    return stmt.run(id)
  }

  async getStatus() {
    if (!this.db) return { mode: 'disconnected' }
    return {
      mode: 'local',
      dbPath: this.db.name,
      connected: true
    }
  }

  async sync() {
    // No-op for local mode, will be expanded for hybrid/cloud mode
    return { success: true, synced: 0 }
  }
}
```

- [ ] **Step 2: Register storage handlers in index.ts**

Add these handlers to the sidecar index.ts:

```typescript
// node-sidecar/src/index.ts (add after SSH handlers)
import { StorageService } from './services/storage.js'

const storageService = new StorageService()

// Initialize storage on startup using userDataPath from environment or default
const userDataPath =
  process.env.USER_DATA_PATH ||
  path.join(
    process.env.HOME || process.env.USERPROFILE || '',
    '.ai-ssh-assistant'
  )
await storageService.connect(userDataPath)

// Register storage handlers
wsServer.registerHandler('storage:get-connections', async () => {
  return await storageService.getConnections()
})

wsServer.registerHandler('storage:save-connection', async params => {
  return await storageService.saveConnection(params)
})

wsServer.registerHandler('storage:delete-connection', async params => {
  return await storageService.deleteConnection(params.id)
})

wsServer.registerHandler('storage:get-status', async () => {
  return await storageService.getStatus()
})

wsServer.registerHandler('storage:sync', async () => {
  return await storageService.sync()
})

// Notify Tauri that sidecar is ready (via stdout)
console.log('[Sidecar] Ready')
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add storage service to node sidecar"
```

---

## Phase 3.5: AI Handler Migration

### Task 4b: Migrate AI Service to Node Sidecar

**Files:**

- Create: `node-sidecar/src/services/ai-service.ts`
- Modify: `node-sidecar/src/index.ts`

- [ ] **Step 1: Create AI service for API calls and streaming**

```typescript
// node-sidecar/src/services/ai-service.ts
import { OpenAI } from 'openai'

interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface AIStreamOptions {
  model: string
  messages: AIMessage[]
  apiKey: string
  baseURL?: string
  onChunk?: (chunk: string) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

export class AIService {
  private clients: Map<string, any> = new Map()

  private getClient(apiKey: string, baseURL?: string) {
    if (!this.clients.has(apiKey)) {
      this.clients.set(apiKey, new OpenAI({ apiKey, baseURL }))
    }
    return this.clients.get(apiKey)
  }

  async stream(options: AIStreamOptions) {
    const client = this.getClient(options.apiKey, options.baseURL)
    const stream = await client.chat.completions.create({
      model: options.model,
      messages: options.messages,
      stream: true
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content && options.onChunk) {
        options.onChunk(content)
      }
    }
    options.onComplete?.()
  }

  async chat(options: {
    model: string
    messages: AIMessage[]
    apiKey: string
    baseURL?: string
  }) {
    const client = this.getClient(options.apiKey, options.baseURL)
    return await client.chat.completions.create({
      model: options.model,
      messages: options.messages
    })
  }
}
```

- [ ] **Step 2: Register AI handlers in index.ts**

```typescript
// node-sidecar/src/index.ts (add after storage handlers)
import { AIService } from './services/ai-service.js'

const aiService = new AIService()

wsServer.registerHandler('ai:chat', async params => {
  return await aiService.chat({
    model: params.model,
    messages: params.messages,
    apiKey: params.apiKey,
    baseURL: params.baseURL
  })
})

wsServer.registerHandler('ai:stream', async params => {
  // For streaming, we use a callback approach via sendToClient
  await aiService.stream({
    model: params.model,
    messages: params.messages,
    apiKey: params.apiKey,
    baseURL: params.baseURL,
    onChunk: chunk => {
      wsServer.sendToClient('ai:stream-chunk', {
        chunk,
        sessionId: params.sessionId
      })
    },
    onComplete: () => {
      wsServer.sendToClient('ai:stream-complete', {
        sessionId: params.sessionId
      })
    },
    onError: error => {
      wsServer.sendToClient('ai:stream-error', {
        error: error.message,
        sessionId: params.sessionId
      })
    }
  })
})
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add AI service to node sidecar"
```

---

## Phase 4: Tauri Frontend Integration

### Task 5: Connect Tauri Frontend to Node Sidecar

**Files:**

- Modify: `src-tauri/src/lib.rs`
- Create: `src/components/SidecarBridge.ts` (Vue composable)

- [ ] **Step 1: Create Vue composable for WebSocket communication**

```typescript
// src/composables/useSidecar.ts
import { ref, onMounted, onUnmounted } from 'vue'

type PushHandler = (data: any) => void

export function useSidecar() {
  const connected = ref(false)
  const ws = ref<WebSocket | null>(null)
  const pending = new Map<string, any>()
  const pushHandlers = new Map<string, PushHandler[]>()

  function connect() {
    ws.value = new WebSocket('ws://127.0.0.1:3001')

    ws.value.onopen = () => {
      connected.value = true
      console.log('[SidecarBridge] Connected')
    }

    ws.value.onmessage = event => {
      const msg = JSON.parse(event.data)

      // Handle push notifications (channel-based)
      if (msg.channel) {
        const handlers = pushHandlers.get(msg.channel)
        handlers?.forEach(handler => handler(msg))
        return
      }

      // Handle JSON-RPC responses
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg)
        pending.delete(msg.id)
      }
    }

    ws.value.onclose = () => {
      connected.value = false
      setTimeout(connect, 1000) // Reconnect
    }
  }

  async function call(method: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = Date.now()
      ws.value?.send(JSON.stringify({ jsonrpc: '2.0', id, method, params }))
      pending.set(id, (msg: any) => {
        if (msg.error) reject(msg.error)
        else resolve(msg.result)
      })
      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id)
          reject(new Error('Timeout'))
        }
      }, 30000)
    })
  }

  function onPush(channel: string, handler: PushHandler) {
    const handlers = pushHandlers.get(channel) || []
    handlers.push(handler)
    pushHandlers.set(channel, handlers)
  }

  function offPush(channel: string, handler: PushHandler) {
    const handlers = pushHandlers.get(channel) || []
    const idx = handlers.indexOf(handler)
    if (idx !== -1) handlers.splice(idx, 1)
  }

  onMounted(() => connect())
  onUnmounted(() => ws.value?.close())

  return { connected, call, onPush, offPush }
}
```

- [ ] **Step 1b: Add sidecar process spawning to Tauri**

Add to `src-tauri/src/lib.rs`:

```rust
use std::process::Command;
use std::sync::Mutex;

struct SidecarProcess(Mutex<Option<Command>>);

#[tauri::command]
fn start_sidecar(app: tauri::AppHandle) -> Result<(), String> {
    let sidecar_path = app.path().app_data_dir()
        .map_err(|e| e.to_string())?
        .join("sidecar/node-sidecar/dist/index.js");

    let child = Command::new("node")
        .arg(sidecar_path)
        .spawn()
        .map_err(|e| e.to_string())?;

    app.manage(SidecarProcess(Mutex::new(Some(child))));
    Ok(())
}

#[tauri::command]
fn stop_sidecar(app: tauri::AppHandle) -> Result<(), String> {
    let sidecar = app.state::<SidecarProcess>();
    if let Some(mut cmd) = sidecar.0.lock().unwrap().take() {
        cmd.kill().map_err(|e| e.to_string())?;
    }
    Ok(())
}
```

- [ ] **Step 2: Register Tauri commands for app lifecycle**

```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn get_user_data_dir(app: tauri::AppHandle) -> Result<String, String> {
    app.path()
        .app_data_dir()
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: connect Tauri frontend to node sidecar via WebSocket"
```

---

## Phase 5: System Integration

### Task 6: Add System Tray and Window Menu

**Files:**

- Modify: `src-tauri/src/lib.rs`
- Modify: `src-tauri/tauri.conf.json`

- [ ] **Step 1: Configure system tray in tauri.conf.json**

```json
{
  "app": {
    "trayIcon": {
      "iconPath": "icons/icon.png",
      "iconAsTemplate": true
    }
  }
}
```

- [ ] **Step 2: Implement tray logic in Rust**

```rust
// src-tauri/src/lib.rs (add setup_tray function)
fn setup_tray(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    use tauri::menu::{Menu, MenuItem};
    use tauri::tray::TrayIconBuilder;

    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let show = MenuItem::with_id(app, "show", "Show Window", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &quit])?;

    TrayIconBuilder::new()
        .menu(&menu)
        .tooltip("AI SSH Assistant")
        .on_menu_event(|app, event| {
            match event.id.as_ref() {
                "quit" => {
                    app.exit(0);
                }
                "show" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                _ => {}
            }
        })
        .build(app)?;

    Ok(())
}
```

- [ ] **Step 3: Add application menu bar**

```rust
// src-tauri/src/lib.rs (add setup_menu function)
fn setup_menu(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};

    let file_menu = SubmenuBuilder::new(app, "File")
        .item(&MenuItemBuilder::with_id("new_connection", "New Connection").build(app)?)
        .item(&MenuItemBuilder::with_id("settings", "Settings").build(app)?)
        .separator()
        .item(&MenuItemBuilder::with_id("quit", "Quit").build(app)?)
        .build()?;

    let edit_menu = SubmenuBuilder::new(app, "Edit")
        .item(&MenuItemBuilder::with_id("copy", "Copy").build(app)?)
        .item(&MenuItemBuilder::with_id("paste", "Paste").build(app)?)
        .build()?;

    let view_menu = SubmenuBuilder::new(app, "View")
        .item(&MenuItemBuilder::with_id("toggle_fullscreen", "Toggle Fullscreen").build(app)?)
        .item(&MenuItemBuilder::with_id("devtools", "Developer Tools").build(app)?)
        .build()?;

    let help_menu = SubmenuBuilder::new(app, "Help")
        .item(&MenuItemBuilder::with_id("about", "About").build(app)?)
        .build()?;

    let menu = MenuBuilder::new(app)
        .item(&file_menu)
        .item(&edit_menu)
        .item(&view_menu)
        .item(&help_menu)
        .build()?;

    app.set_menu(menu)?;

    app.on_menu_event(|app, event| {
        match event.id().as_ref() {
            "quit" => app.exit(0),
            "toggle_fullscreen" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.set_fullscreen(!window.is_fullscreen().unwrap_or(false));
                }
            }
            "devtools" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.open_devtools();
                }
            }
            _ => {}
        }
    });

    Ok(())
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add system tray and menu bar support"
```

---

## Phase 6: Build Configuration

### Task 7: Configure Multi-Platform Builds

**Files:**

- Modify: `src-tauri/tauri.conf.json`
- Create: `.github/workflows/release.yml`

- [ ] **Step 1: Configure bundle targets for all platforms**

```json
// src-tauri/tauri.conf.json
{
  "bundle": {
    "active": true,
    "targets": ["nsis", "msi", "dmg", "app", "deb", "appimage"],
    "icon": ["icons/icon.ico", "icons/icon.png", "icons/icon.icns"],
    "windows": {
      "nsis": {
        "installMode": "currentUser"
      }
    }
  }
}
```

- [ ] **Step 2: Create GitHub Actions workflow**

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    strategy:
      matrix:
        platform: [macos-latest, ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Build Tauri app
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "ci: add multi-platform build workflow"
```

---

## Phase 7: Testing and Polish

### Task 8: End-to-End Testing

**Files:**

- Create: `tests/e2e/ssh.test.ts`
- Create: `tests/e2e/ai.test.ts`
- Create: `tests/e2e/storage.test.ts`

- [ ] **Step 1: Test SSH connection flow**

```typescript
// tests/e2e/ssh.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('SSH Connection', () => {
  let wsServer: any, sshManager: any

  beforeAll(async () => {
    // Start sidecar, connect WebSocket client
  })

  afterAll(async () => {
    // Cleanup
  })

  it('should connect to SSH server', async () => {
    const result = await call('ssh:connect', {
      host: 'test-server',
      port: 22,
      username: 'test',
      password: 'test'
    })
    expect(result.status).toBe('connected')
    expect(result.id).toBeDefined()
  })

  it('should execute command and return output', async () => {
    const result = await call('ssh:execute', {
      id: 'test-conn-id',
      command: 'echo hello'
    })
    expect(result.success).toBe(true)
    expect(result.output).toContain('hello')
  })

  it('should handle command timeout', async () => {
    const result = await call('ssh:execute', {
      id: 'test-conn-id',
      command: 'sleep 600' // Will timeout
    })
    expect(result.success).toBe(false)
    expect(result.error).toContain('超时')
  })
})
```

- [ ] **Step 2: Test AI streaming**

```typescript
// tests/e2e/ai.test.ts
import { describe, it, expect } from 'vitest'

describe('AI Streaming', () => {
  it('should receive streaming chunks', async () => {
    const chunks: string[] = []
    await call('ai:stream', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Say hello' }],
      apiKey: process.env.OPENAI_API_KEY,
      sessionId: 'test-session'
    })
    // Wait for completion callback
    await new Promise(resolve => setTimeout(resolve, 5000))
    expect(chunks.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 3: Test file operations**

```typescript
// tests/e2e/storage.test.ts
import { describe, it, expect } from 'vitest'

describe('Storage', () => {
  it('should save and retrieve connections', async () => {
    const saved = await call('storage:save-connection', {
      name: 'Test Server',
      host: '192.168.1.1',
      port: 22,
      username: 'admin',
      authType: 'password'
    })
    expect(saved.id).toBeDefined()

    const connections = await call('storage:get-connections')
    expect(connections).toContainEqual(
      expect.objectContaining({ name: 'Test Server' })
    )
  })
})
```

- [ ] **Step 4: Verify bundle sizes on all platforms**

Note: The test scaffolds below require actual implementation with proper test
setup (imports, test runner config, etc.).

```bash
# Build and check sizes
pnpm build:tauri

# Windows
ls -lh src-tauri/target/release/bundle/nsis/*.exe

# macOS (CI only)
# ls -lh src-tauri/target/release/bundle/dmg/*.dmg

# Linux (CI only)
# ls -lh src-tauri/target/release/bundle/deb/*.deb

# Expected: Windows installer < 15MB, unpacked < 12MB
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "test: add e2e tests for SSH, AI, and storage"
```

---

## Summary

| Phase                    | Tasks | Estimated Time |
| ------------------------ | ----- | -------------- |
| 1. Project Scaffolding   | 2     | 30 min         |
| 2. SSH Handler Migration | 1     | 2 hours        |
| 3. Storage Migration     | 1     | 1 hour         |
| 4. Frontend Integration  | 1     | 1 hour         |
| 5. System Integration    | 1     | 30 min         |
| 6. Build Configuration   | 1     | 30 min         |
| 7. Testing               | 1     | 2 hours        |

**Total Estimated Time:** ~8 hours

---

## References

- Spec: `docs/superpowers/specs/2026-03-25-tauri-migration-design.md`
- Original SSH handlers: `apps/desktop/electron/ipc/ssh-handlers.ts`
- Original main process: `apps/desktop/electron/main/index.ts`
