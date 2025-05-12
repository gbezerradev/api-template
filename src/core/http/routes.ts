import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { me } from './controllers/me'

export async function appRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok' }
  })

  app.post('/register', register)
  app.post('/authenticate', authenticate)

  app.get('/me', {
    preHandler: [app.authenticate],
  }, me)
  
}
