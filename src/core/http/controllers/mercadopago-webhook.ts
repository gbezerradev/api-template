import { FastifyRequest, FastifyReply } from 'fastify'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { env } from '@/config/env'
import { prisma } from '@/core/lib/prisma'
import { addDays } from 'date-fns'

const mp = new MercadoPagoConfig({
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN,
})
const paymentClient = new Payment(mp)

export async function mercadoPagoWebhook(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  interface MercadoPagoWebhookBody {
    type?: string
    data?: {
      id?: string
    }
    [key: string]: unknown
  }

  const body = request.body as MercadoPagoWebhookBody
  const paymentId = body?.data?.id

  console.log(`[Webhook] Received body: ${JSON.stringify(body)}`)

  if (!paymentId || body.type !== 'payment') {
    return reply.status(400).send({ message: 'Invalid webhook payload' })
  }

  console.log(`[Webhook] Received payment notification for ID: ${paymentId}`)

  try {
    const payment = await paymentClient.get({ id: paymentId })

    if (payment.status !== 'approved') {
      return reply
        .status(200)
        .send({ message: 'Ignoring non-approved payment' })
    }

    console.log(payment)

    const metadata = payment.metadata
    const userId = metadata?.user_id
    const planId = metadata?.plan_id
    const externalId = metadata?.external_id

    console.log(
      `[Webhook] Payment metadata: userId=${userId}, planId=${planId}, externalId=${externalId}`,
    )

    if (!userId || !planId || !externalId) {
      return reply.status(400).send({ message: 'Missing metadata fields' })
    }

    console.log(
      `[Webhook] Payment approved for user ${userId} with plan ${planId}`,
    )

    // 1. Cancela qualquer assinatura ativa existente do usuário
    await prisma.subscription.updateMany({
      where: {
        user_id: userId,
        status: 'active',
      },
      data: {
        status: 'canceled',
      },
    })

    // 2. Cria nova assinatura com base no pagamento
    await prisma.subscription.create({
      data: {
        user_id: userId,
        plan_id: planId,
        external_id: externalId,
        status: 'active',
        current_period_start: new Date(),
        current_period_end: addDays(new Date(), 30),
      },
    })

    console.log(
      `[Webhook] New subscription created for user ${userId} with plan ${planId}`,
    )

    return reply.status(200).send({ ok: true })
  } catch (err) {
    console.error('[Webhook] Failed to handle payment', err)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
