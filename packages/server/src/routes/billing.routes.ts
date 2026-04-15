import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { billingService } from '../services/billing.service.js'
import { SubscriptionPlanCode } from '../../../database/src/generated/client/index.js'

interface ActivateSubscriptionBody {
  bizId: string
  sessionId: string
  planCode: keyof typeof SubscriptionPlanCode
}

export async function billingRoutes(fastify: FastifyInstance) {
  fastify.get('/subscription', { preHandler: fastify.authenticate }, async (request, reply) => {
    const user = request.user as any
    const data = await billingService.getSubscriptionState(user.userId)
    return reply.send({ success: true, message: '获取订阅状态成功', data })
  })

  fastify.post<{ Body: ActivateSubscriptionBody }>(
    '/activate-subscription',
    { preHandler: fastify.authenticate },
    async (request: FastifyRequest<{ Body: ActivateSubscriptionBody }>, reply: FastifyReply) => {
      const user = request.user as any
      const { bizId, sessionId, planCode } = request.body

      const data = await billingService.activateSubscription({
        userId: user.userId,
        bizId,
        sessionId,
        planCode: SubscriptionPlanCode[planCode]
      })

      return reply.send({ success: true, message: '订阅生效成功', data })
    }
  )
}
