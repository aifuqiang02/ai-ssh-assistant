export interface ChatSession {
  id: string
  title: string
  config?: Record<string, any>
}

class ChatService {
  private getStorageKey(sessionId: string) {
    return `chat-session-config-${sessionId}`
  }

  async getSession(sessionId: string): Promise<ChatSession | null> {
    const rawConfig = localStorage.getItem(this.getStorageKey(sessionId))
    const config = rawConfig ? JSON.parse(rawConfig) : {}

    return {
      id: sessionId,
      title: config.title || '',
      config
    }
  }

  async updateSession(sessionId: string, updateData: Partial<ChatSession>): Promise<void> {
    const currentSession = await this.getSession(sessionId)
    const nextConfig = {
      ...(currentSession?.config || {}),
      ...(updateData.config || {})
    }

    if (updateData.title !== undefined) {
      nextConfig.title = updateData.title
    }

    localStorage.setItem(this.getStorageKey(sessionId), JSON.stringify(nextConfig))
  }
}

export const chatService = new ChatService()
