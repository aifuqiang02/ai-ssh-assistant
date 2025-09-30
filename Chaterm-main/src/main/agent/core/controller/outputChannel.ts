import { OutputChannel } from 'vscode'
import { app } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

export class ElectronOutputChannel implements OutputChannel {
  private logFile: string
  private buffer: string[] = []
  private isShown: boolean = false
  private _name: string

  constructor(name: string = 'Cline') {
    this._name = name
    // Create a log file in the user data directory
    this.logFile = path.join(app.getPath('userData'), `${name}.log`)
  }

  get name(): string {
    return this._name
  }

  append(value: string): void {
    this.buffer.push(value)
    this.writeToFile(value)
  }

  appendLine(value: string): void {
    this.append(value + '\n')
  }

  clear(): void {
    this.buffer = []
    // Clear the log file
    fs.writeFileSync(this.logFile, '')
  }

  show(): void {
    this.isShown = true
  }

  hide(): void {
    this.isShown = false
  }

  dispose(): void {
    this.buffer = []
  }

  replace(value: string): void {
    this.clear()
    this.append(value)
  }

  private writeToFile(content: string): void {
    try {
      fs.appendFileSync(this.logFile, content)
    } catch (error) {
      console.error('Failed to write to log file:', error)
    }
  }
}
