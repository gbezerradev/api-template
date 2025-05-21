import { PrismaPlansRepository } from '@/core/repositories/prisma/prisma-plans-repository'
import { makeGenerateCheckout } from '@/core/use-cases/subscription/factories/make-generate-checkout'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

interface CreateSubscriptionRequest extends FastifyRequest {
  user: {
    sub: string
  }
}

export async function generateCheckout(
  request: CreateSubscriptionRequest,
  reply: FastifyReply,
): Promise<void> {
  const userId = request.user.sub
  const bodySchema = z.object({
    planId: z.string(),
  })
  const { planId } = bodySchema.parse(request.body)

  try {
    const plansRepository = new PrismaPlansRepository()
    const plan = await plansRepository.findById(planId)

    if (!plan) {
      return reply.status(404).send({ message: 'Plan not found' })
    }

    const gateway = makeGenerateCheckout()
    const checkout = await gateway.createSubscription(userId, plan)

    return reply.status(200).send({ checkoutUrl: checkout.checkoutUrl })
  } catch (err) {
    console.error(err)
    return reply.status(500).send({ message: 'Could not generate checkout' })
  }
}
