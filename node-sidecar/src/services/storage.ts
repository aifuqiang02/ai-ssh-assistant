import Database from 'better-sqlite3'
import path from 'path'

export class StorageService {
  private db: Database.Database | null = null

  connect(userDataPath: string) {
    const dbPath = path.join(userDataPath, 'local.db')
    this.db = new Database(dbPath)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS connections (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        host TEXT NOT NULL,
        port INTEGER NOT NULL,
        username TEXT NOT NULL,
        authType TEXT,
        password TEXT,
        privateKey TEXT,
        lastUsed TEXT
      )
    `)

    console.log('[Storage] Connected to SQLite at', dbPath)
  }

  getConnections() {
    if (!this.db) throw new Error('Database not connected')
    const stmt = this.db.prepare('SELECT * FROM connections')
    return stmt.all()
  }

  saveConnection(config: any) {
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

  disconnect() {
    this.db?.close()
    this.db = null
  }

  deleteConnection(id: string) {
    if (!this.db) throw new Error('Database not connected')
    const stmt = this.db.prepare('DELETE FROM connections WHERE id = ?')
    return stmt.run(id)
  }

  getStatus() {
    if (!this.db) return { mode: 'disconnected' }
    return {
      mode: 'local',
      dbPath: this.db.name,
      connected: true
    }
  }

  sync() {
    return { success: true, synced: 0 }
  }
}
