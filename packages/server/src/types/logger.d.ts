import 'pino'

declare module 'pino' {
  interface Logger {
    error(msg: string, ...args: any[]): void
    error(obj: object, msg?: string, ...args: any[]): void
    warn(msg: string, ...args: any[]): void
    warn(obj: object, msg?: string, ...args: any[]): void
    info(msg: string, ...args: any[]): void
    info(obj: object, msg?: string, ...args: any[]): void
    debug(msg: string, ...args: any[]): void
    debug(obj: object, msg?: string, ...args: any[]): void
    trace(msg: string, ...args: any[]): void
    trace(obj: object, msg?: string, ...args: any[]): void
    fatal(msg: string, ...args: any[]): void
    fatal(obj: object, msg?: string, ...args: any[]): void
  }
}

