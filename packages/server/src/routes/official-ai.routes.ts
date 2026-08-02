import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { officialAiUsageService } from '../services/official-ai-usage.service.js'
import { officialAiChatService } from '../services/official-ai-chat.service.js'

interface OfficialChatBody {
  modelId: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  stream?: boolean
  temperature?: number
  maxTokens?: number
  tools?: object[]
  toolChoice?: string | object
}

export async function officialAiRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/status',
    { preHandler: fastify.authenticate },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const data = officialAiUsageService.getStatus()
      return reply.send({ success: true, message: '获取官方模型状态成功', data })
    }
  )

  fastify.post<{ Body: OfficialChatBody }>(
    '/chat',
    { preHandler: fastify.authenticate },
    async (request: FastifyRequest<{ Body: OfficialChatBody }>, reply: FastifyReply) => {
      const user = request.user as any
      const { modelId, messages, stream, temperature, maxTokens, tools, toolChoice } = request.body
      const controller = new AbortController()
      const abortUpstream = () => controller.abort()
      request.raw.once('aborted', abortUpstream)
      reply.raw.once('close', abortUpstream)

      try {
        const data = await officialAiChatService.createChatCompletion({
          userId: user.userId,
          modelId,
          messages,
          stream,
          temperature,
          maxTokens,
          tools,
          toolChoice,
          signal: controller.signal
        })

        if (stream) {
          reply.raw.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
          })

          for await (const chunk of data as AsyncIterable<any>) {
            if (controller.signal.aborted) break
            reply.raw.write(`data: ${JSON.stringify(chunk)}\n\n`)
          }
          if (!controller.signal.aborted) {
            reply.raw.write('data: [DONE]\n\n')
            reply.raw.end()
          }
          return reply
        }

        return reply.send({ success: true, message: '官方模型调用成功', data })
      } finally {
        request.raw.removeListener('aborted', abortUpstream)
        reply.raw.removeListener('close', abortUpstream)
      }
    }
  )
}
