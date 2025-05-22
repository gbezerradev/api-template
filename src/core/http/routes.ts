import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { me } from './controllers/me'
import {
  authenticateJsonSchema,
  authenticateResponseJsonSchema,
  registerUserJsonSchema,
  userResponseJsonSchema,
} from './schemas/user-schema'
import { generateCheckout } from './controllers/generate-checkout'
import { mercadoPagoWebhook } from './controllers/mercadopago-webhook'

export async function appRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok' }
  })

  app.post(
    '/register',
    {
      schema: {
        body: registerUserJsonSchema,
      },
    },
    register,
  )

  app.post(
    '/authenticate',
    {
      schema: {
        body: authenticateJsonSchema,
        response: {
          200: authenticateResponseJsonSchema,
        },
      },
    },
    authenticate,
  )

  app.get(
    '/me',
    {
      schema: {
        response: {
          200: userResponseJsonSchema,
        },
      },
      preHandler: [app.authenticate],
    },
    me,
  )

  app.post(
    '/subscription/checkout',
    {
      preHandler: [app.authenticate],
    },
    generateCheckout,
  )

  app.post('/webhooks/mercadopago', mercadoPagoWebhook)
}
