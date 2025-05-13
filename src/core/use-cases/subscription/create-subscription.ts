import { PaymentGateway } from '@/core/contracts/payment-gateway'
import { SubscriptionsRepository } from '@/core/repositories/subscriptions-repository'

interface CreateSubscriptionUseCaseRequest {
  userId: string
  plan: string
}

export class CreateSubscriptionUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private paymentGateway: PaymentGateway,
  ) {}

  async execute({ userId }: CreateSubscriptionUseCaseRequest) {
    const subscriptionData = await this.paymentGateway.createSubscription(
      userId,
      'monthly',
    )

    const subscription = await this.subscriptionsRepository.create({
      userId,
      externalId: subscriptionData.externalId,
      status: subscriptionData.status,
      plan: subscriptionData.plan,
      currentPeriodStart: subscriptionData.currentPeriodStart,
      currentPeriodEnd: subscriptionData.currentPeriodEnd,
    })

    return {
      subscription,
    }
  }
}
