import { UsersRepository } from '@/core/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-alredy-exists'
import { User } from '@prisma/client'
import { env } from '@/config/env'
import { SubscriptionsRepository } from '@/core/repositories/subscriptions-repository'
import { v4 as uuidv4 } from 'uuid'
import { addDays } from 'date-fns'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, env.HASH_SALT_ROUNDS)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      email,
      name,
      password_hash,
    })

    await this.subscriptionsRepository.create({
      userId: user.id,
      planId: 'starter',
      status: 'active',
      externalId: uuidv4(),
      currentPeriodStart: new Date(),
      currentPeriodEnd: addDays(new Date(), 30),
    })

    return { user }
  }
}
