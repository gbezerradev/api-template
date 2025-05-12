import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from '@/core/use-cases/users/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/core/use-cases/users/factories/make-authenticate-use-case'
import { AuthenticateInput, AuthenticateResponse } from '../schemas/user-schema'

export async function authenticate(
  request: FastifyRequest<{ Body: AuthenticateInput }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign({ sub: user.id }, { expiresIn: '7d'})

    return reply.status(200).send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}