import { PrismaUsersRepository } from '@/core/repositories/prisma/prisma-users-repository'
import { MeUseCase } from '../me'

export function makeMeUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const authenticateUseCase = new MeUseCase(usersRepository)

  return authenticateUseCase
}