import { FastifyRequest, FastifyReply } from 'fastify'
import { makeRegisterUseCase } from '@/core/use-cases/users/factories/make-register-use-case'
import { UserAlreadyExistsError } from '@/core/use-cases/users/errors/user-alredy-exists'
import { RegisterUserInput } from '../schemas/user-schema'

export async function register(request: FastifyRequest<{
  Body: RegisterUserInput
}>, reply: FastifyReply) {
  const { email, name, password } = request.body

  console.log('Registering user:', { email, name, password })

  try {
    const registerUseCase = makeRegisterUseCase()
    await registerUseCase.execute({ email, name, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
