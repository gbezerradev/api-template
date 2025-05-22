import { prisma } from '@/core/lib/prisma'
import { Subscription } from '@prisma/client'
import { SubscriptionsRepository } from '../subscriptions-repository'

export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  async create(data: {
    userId: string
    status: string
    planId: string
    externalId: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
  }): Promise<Subscription> {
    return prisma.subscription.create({
      data: {
        user_id: data.userId,
        status: data.status,
        plan_id: data.planId,
        external_id: data.externalId,
        current_period_start: data.currentPeriodStart,
        current_period_end: data.currentPeriodEnd,
      },
    })
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    return prisma.subscription.findUnique({
      where: { user_id: userId },
    })
  }

  async cancel(externalId: string): Promise<void> {
    await prisma.subscription.updateMany({
      where: { external_id: externalId },
      data: { status: 'canceled' },
    })
  }
}
