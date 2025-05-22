import { MercadoPagoGateway } from '@/core/gateways/mercado-pago/payment-gateway'
import { PrismaUsersRepository } from '@/core/repositories/prisma/prisma-users-repository'

export function makeGenerateCheckout() {
  const usersRepository = new PrismaUsersRepository()
  const gateway = new MercadoPagoGateway(usersRepository)

  return gateway
}
