// src/core/repositories/subscriptions-repository.ts
import { Subscription } from '@prisma/client'

export interface SubscriptionsRepository {
  create(data: {
    userId: string
    status: string
    plan: string
    externalId: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
  }): Promise<Subscription>

  findByUserId(userId: string): Promise<Subscription | null>

  cancel(externalId: string): Promise<void>
}
