import { PrismaSubscriptionsRepository } from '@/core/repositories/prisma/prisma-subscriptions-repository'
import { MercadoPagoGateway } from '@/core/gateways/mercado-pago/payment-gateway'
import { CreateSubscriptionUseCase } from '../create-subscription'
import { PrismaUsersRepository } from '@/core/repositories/prisma/prisma-users-repository'
import { PrismaPlansRepository } from '@/core/repositories/prisma/prisma-plans-repository'

export function makeCreateSubscriptionUseCase() {
  const subscriptionsRepository = new PrismaSubscriptionsRepository()
  const usersRepository = new PrismaUsersRepository()
  const plansRepository = new PrismaPlansRepository()
  const paymentGateway = new MercadoPagoGateway(usersRepository)

  return new CreateSubscriptionUseCase(
    subscriptionsRepository,
    paymentGateway,
    plansRepository,
  )
}
