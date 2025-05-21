import { PaymentGateway } from '@/core/contracts/payment-gateway'
import { PlansRepository } from '@/core/repositories/plans-repository'
import { SubscriptionsRepository } from '@/core/repositories/subscriptions-repository'

interface CreateSubscriptionUseCaseRequest {
  userId: string
  planId: string
}

export class CreateSubscriptionUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private paymentGateway: PaymentGateway,
    private plansRepository: PlansRepository,
  ) {}

  async execute({ userId, planId }: CreateSubscriptionUseCaseRequest) {
    const plan = await this.plansRepository.findById(planId)
    if (!plan) {
      throw new Error('Plan not found')
    }

    const subscriptionData = await this.paymentGateway.createSubscription(
      userId,
      plan,
    )

    const subscription = await this.subscriptionsRepository.create({
      userId,
      externalId: subscriptionData.externalId,
      status: subscriptionData.status,
      planId: plan.id,
      currentPeriodStart: subscriptionData.currentPeriodStart,
      currentPeriodEnd: subscriptionData.currentPeriodEnd,
    })

    return {
      subscription,
    }
  }
}
