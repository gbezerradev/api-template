import 'fastify'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string
    }
    user: {
      sub: string
    }
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}
