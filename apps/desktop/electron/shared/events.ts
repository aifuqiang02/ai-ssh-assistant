import { EventEmitter } from 'events'
import { BrowserWindow } from 'electron'

class WindowEventEmitter extends EventEmitter {
  private mainWindow: BrowserWindow | null = null

  setMainWindow(window: BrowserWindow) {
    this.mainWindow = window
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow
  }

  sendToRenderer(channel: string, ...args: any[]) {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send(channel, ...args)
    }
  }
}

export const windowEvents = new WindowEventEmitter()
