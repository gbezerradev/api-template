import { makeMeUseCase } from "@/core/use-cases/users/factories/make-me-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function me(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const meUseCase = makeMeUseCase();
    const userId = request.user.sub;
    const user = await meUseCase.execute(userId);

    return reply.status(200).send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
}
}