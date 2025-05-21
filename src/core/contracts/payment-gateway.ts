import { Plan } from '@prisma/client'

export interface SubscriptionData {
  externalId: string
  status: 'active' | 'pending' | 'canceled'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  plan: string
  checkoutUrl: string
}

export interface PaymentGateway {
  createSubscription(userId: string, plan: Plan): Promise<SubscriptionData>
  cancelSubscription(externalId: string): Promise<void>
  getSubscription(externalId: string): Promise<SubscriptionData | null>
}
