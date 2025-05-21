import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.plan.createMany({
    data: [
      {
        id: 'starter',
        name: 'Plano Starter',
        description: 'Plano gratuito com recursos limitados',
        price: 0,
        periodDays: 30,
      },
      {
        id: 'pro_monthly',
        name: 'Plano Pro Mensal',
        description: 'Assinatura mensal com recursos premium',
        price: 1500, // R$15,00
        periodDays: 30,
      },
      {
        id: 'pro_semestral',
        name: 'Plano Pro Semestral',
        description: 'Assinatura semestral com desconto',
        price: 7500, // R$75,00
        periodDays: 180,
      },
    ],
  })
}

main()
  .then(() => {
    console.log('✅ Plans seeded.')
    return prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    return prisma.$disconnect().finally(() => process.exit(1))
  })
