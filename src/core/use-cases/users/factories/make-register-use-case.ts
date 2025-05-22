import { PrismaUsersRepository } from '@/core/repositories/prisma/prisma-users-repository'
import { PrismaSubscriptionsRepository } from '@/core/repositories/prisma/prisma-subscriptions-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const subscriptionsRepository = new PrismaSubscriptionsRepository()
  const registerUseCase = new RegisterUseCase(
    usersRepository,
    subscriptionsRepository,
  )

  return registerUseCase
}
