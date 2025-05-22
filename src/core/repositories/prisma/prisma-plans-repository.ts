import { Plan } from '@prisma/client'
import { PlansRepository } from '../plans-repository'
import { prisma } from '@/core/lib/prisma'

export class PrismaPlansRepository implements PlansRepository {
  async findById(id: string): Promise<Plan | null> {
    return prisma.plan.findUnique({ where: { id } })
  }

  async findAll(): Promise<Plan[]> {
    return prisma.plan.findMany()
  }
}
