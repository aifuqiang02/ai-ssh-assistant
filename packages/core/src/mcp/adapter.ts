import { MCPClient, MCPToolInfo } from './client'

interface MCPToolDefinition {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export class MCPToolAdapter implements MCPToolDefinition {
  private client: MCPClient
  public readonly name: string
  public readonly description: string
  public readonly parameters: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }

  constructor(client: MCPClient, toolInfo: MCPToolInfo) {
    this.client = client
    this.name = `mcp:${toolInfo.name}`
    this.description = toolInfo.description
    this.parameters = {
      type: 'object',
      properties: toolInfo.inputSchema.properties || {},
      required: toolInfo.inputSchema.required || []
    }
  }

  async execute(params: Record<string, unknown>): Promise<unknown> {
    const toolName = this.name.replace(/^mcp:/, '')
    return this.client.callTool(toolName, params)
  }
}

export async function loadMCPTools(
  mcpUrl: string,
  options?: { timeout?: number }
): Promise<MCPToolDefinition[]> {
  const client = new MCPClient({ timeout: options?.timeout })
  await client.connect(mcpUrl)

  const tools = await client.listTools()

  return tools.map(tool => new MCPToolAdapter(client, tool))
}

export async function loadMCPToolsWithClient(client: MCPClient): Promise<MCPToolDefinition[]> {
  const tools = await client.listTools()

  return tools.map(tool => new MCPToolAdapter(client, tool))
}
