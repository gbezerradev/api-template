import { FastifyReply, FastifyRequest } from 'fastify';

export async function jwtPlugin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' } );
  }
}