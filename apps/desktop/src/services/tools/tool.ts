import z from 'zod'

export namespace Tool {
  interface Metadata {
    [key: string]: any
  }

  export type Context<M extends Metadata = Metadata> = {
    sessionID: string
    messageID: string
    agent: string
    abort: AbortSignal
    callID?: string
    extra?: { [key: string]: any }
    metadata(input: { title?: string; metadata?: M }): void
  }

  type InitFunction = () => Promise<{
    description: string
    parameters: z.ZodType
    execute: (
      args: any,
      ctx: Context
    ) => Promise<{
      title: string
      metadata: Metadata
      output: string
    }>
  }>

  export interface ToolInfo {
    id: string
    init: InitFunction
  }

  export function define(id: string, init: InitFunction): ToolInfo {
    return {
      id,
      init: async () => {
        const toolInfo = await init()
        const execute = toolInfo.execute
        toolInfo.execute = async (args, ctx) => {
          try {
            toolInfo.parameters.parse(args)
          } catch (error) {
            throw new Error(`The ${id} tool was called with invalid arguments: ${error}`, {
              cause: error
            })
          }
          return execute(args, ctx)
        }
        return toolInfo
      }
    }
  }

  export type InferParameters<T extends ToolInfo> = T extends ToolInfo
    ? ReturnType<T['init']> extends Promise<infer U>
      ? U extends { parameters: infer P }
        ? P extends z.ZodType
          ? z.infer<P>
          : never
        : never
      : never
    : never
}
