import { PrismaSubscriptionsRepository } from '@/core/repositories/prisma/prisma-subscriptions-repository'
import { MercadoPagoGateway } from '@/core/gateways/mercado-pago/payment-gateway'
import { CreateSubscriptionUseCase } from '../create-subscription'

export function makeCreateSubscriptionUseCase() {
  const subscriptionsRepository = new PrismaSubscriptionsRepository()
  const paymentGateway = new MercadoPagoGateway()

  return new CreateSubscriptionUseCase(subscriptionsRepository, paymentGateway)
}
