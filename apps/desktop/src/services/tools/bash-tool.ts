import z from 'zod'
import { Tool } from './tool'

export const BashTool = Tool.define('bash', async () => {
  return {
    description: 'Execute a shell command',
    parameters: z.object({
      command: z.string().describe('The command to execute'),
      timeout: z.number().describe('Timeout in milliseconds').optional()
    }),
    async execute({ command, timeout }) {
      void timeout
      return {
        title: 'Command executed',
        metadata: {},
        output: `Executed: ${command}`
      }
    }
  }
})
