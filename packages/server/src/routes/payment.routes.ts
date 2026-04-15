import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { SubscriptionPlanCode } from '../../../database/src/generated/client/index.js'
import { billingService } from '../services/billing.service.js'

interface CreatePaymentSessionBody {
  bizId: string
  planCode: keyof typeof SubscriptionPlanCode
}

export async function paymentRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreatePaymentSessionBody }>(
    '/sessions',
    { preHandler: fastify.authenticate },
    async (request: FastifyRequest<{ Body: CreatePaymentSessionBody }>, reply: FastifyReply) => {
      const user = request.user as any
      const { bizId, planCode } = request.body
      const notifyUrl = `http://127.0.0.1:${process.env.PORT || 3000}/api/v1/payment/notify`

      const data = await billingService.createPaymentSession({
        bizId,
        planCode: SubscriptionPlanCode[planCode],
        notifyUrl,
        userId: user.userId
      })

      return reply.send({ success: true, message: '支付二维码生成成功', data })
    }
  )

  fastify.post('/notify', async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await billingService.handlePaymentNotify(
      (request.body as Record<string, unknown>) || {}
    )
    return reply.send(data)
  })
}
