import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  HASH_SALT_ROUNDS: z.coerce.number().default(12),
  JWT_SECRET: z.string(),
  MERCADO_PAGO_ACCESS_TOKEN: z.string(),
  MERCADO_PAGO_PUBLIC_KEY: z.string(),
  APP_URL: z.string().url(),
  // MERCADO_PAGO_CLIENT_ID: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('Environment validation failed', _env.error.format())

  throw new Error('Environment validation failed')
}

export const env = _env.data
