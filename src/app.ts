import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { appRoutes } from './core/http/routes'
import { ZodError } from 'zod'
import { env } from './config/env'
import { jwtPlugin } from './core/plugins/jwt'

export const app = fastify({
  ajv: {
    customOptions: {
      coerceTypes: true,
    },
  }
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.decorate('authenticate', jwtPlugin)

app.register(appRoutes)
app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (error.validation) {
    return reply.status(400).send({
      message: 'Validation failed',
      issues: error.validation,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
