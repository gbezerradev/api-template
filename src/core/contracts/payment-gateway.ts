export interface SubscriptionData {
  externalId: string
  status: 'active' | 'pending' | 'canceled'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  plan: string
}

export interface PaymentGateway {
  createSubscription(userId: string, plan: string): Promise<SubscriptionData>
  cancelSubscription(externalId: string): Promise<void>
  getSubscription(externalId: string): Promise<SubscriptionData | null>
}
