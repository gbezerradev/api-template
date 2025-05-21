import { env } from '@/config/env'
import {
  PaymentGateway,
  SubscriptionData,
} from '@/core/contracts/payment-gateway'
import { UsersRepository } from '@/core/repositories/users-repository'
import { Plan } from '@prisma/client'
import { addDays } from 'date-fns'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { v4 as uuidv4 } from 'uuid'

const client = new MercadoPagoConfig({
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN,
})

export class MercadoPagoGateway implements PaymentGateway {
  constructor(private usersRepository: UsersRepository) {}
  async createSubscription(
    userId: string,
    plan: Plan,
  ): Promise<SubscriptionData> {
    const externalId = uuidv4()
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: [
          {
            id: plan.id,
            title: plan.name,
            description: plan.description,
            quantity: 1,
            unit_price: plan.price / 100,
            currency_id: 'BRL',
          },
        ],
        metadata: {
          userId,
          planId: plan.id,
          externalId,
        },
        payer: {
          email: user.email,
        },
        back_urls: {
          success: 'https://google.com',
          failure: 'https://google.com',
          pending: 'https://google.com',
        },
        auto_return: 'approved',
      },
    })

    return {
      externalId,
      plan: plan.id,
      status: 'pending',
      currentPeriodStart: new Date(),
      currentPeriodEnd: addDays(new Date(), 30),
      checkoutUrl: result.init_point ?? '',
    }
  }

  async cancelSubscription(externalId: string): Promise<void> {}

  async getSubscription(externalId: string): Promise<SubscriptionData | null> {
    return null
  }
}
