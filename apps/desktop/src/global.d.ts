interface ElectronAPI {
  ssh: {
    getTree: (userId: string) => Promise<any>
    resize: (id: string, cols: number, rows: number) => Promise<void>
  }
  fs: {
    mkdirRecursive: (dirPath: string) => Promise<void>
    writeFile: (filePath: string, content: string) => Promise<void>
    appendFile: (filePath: string, content: string) => Promise<void>
    readFile: (filePath: string) => Promise<string>
    getPathForFile: (file: File) => string
  }
  shell: {
    showItemInFolder: (fullPath: string) => Promise<void>
  }
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
    isSecureContext: boolean
  }
  interface Navigator {
    clipboard: Clipboard
  }
  interface Document {
    execCommand: (commandId: string, showUI?: boolean, value?: string) => boolean
  }
  var localStorage: Storage
  function confirm(message?: string): boolean
  function alert(message?: string): void
}

export {}
