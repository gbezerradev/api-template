import { UsersRepository } from '@/core/repositories/users-repository'

export class MeUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(userId: string) {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }
}
