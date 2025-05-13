import { makeCreateSubscriptionUseCase } from '@/core/use-cases/subscription/factories/make-create-subscription-use-case'
import { Subscription } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

interface CreateSubscriptionRequest extends FastifyRequest {
  user: {
    sub: string
  }
}

interface CreateSubscriptionResponse {
  subscription: Subscription
  checkoutUrl?: string
}

export async function createSubscription(
  request: CreateSubscriptionRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub

  const createSubscription = makeCreateSubscriptionUseCase()

  const result = await createSubscription.execute({
    userId,
    plan: 'pro_monthly',
  })

  const { subscription, checkoutUrl } = result as CreateSubscriptionResponse

  return reply.status(201).send({
    subscription,
    checkoutUrl,
  })
}
