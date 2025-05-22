import { Plan } from '@prisma/client'

export interface PlansRepository {
  findById(id: string): Promise<Plan | null>
  findAll(): Promise<Plan[]>
}
