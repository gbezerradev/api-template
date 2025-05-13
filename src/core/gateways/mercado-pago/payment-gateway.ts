import { env } from '@/config/env'
import {
  PaymentGateway,
  SubscriptionData,
} from '@/core/contracts/payment-gateway'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { v4 as uuidv4 } from 'uuid'

const client = new MercadoPagoConfig({
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN,
  options: {
    timeout: 5000,
  },
})

export class MercadoPagoGateway implements PaymentGateway {
  async createSubscription(
    userId: string,
    plan: string,
  ): Promise<SubscriptionData> {
    const externalId = uuidv4()

    const preference = new Preference(client)

    await preference.create({
      body: {
        items: [
          {
            id: 'plan-pro-mensal',
            title: 'Plano Pro Mensal',
            unit_price: 29,
            quantity: 1,
          },
        ],
        metadata: {
          userId,
          plan,
          externalId,
        },
        notification_url: `http://localhost:3434/webhooks/mercadopago`,
      },
    })

    return {
      externalId,
      plan,
      status: 'pending',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  }

  async cancelSubscription(externalId: string): Promise<void> {}

  async getSubscription(externalId: string): Promise<SubscriptionData | null> {
    return null
  }
}
