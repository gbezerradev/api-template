import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export const registerUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

export const registerUserJsonSchema = zodToJsonSchema(registerUserSchema, {
  target: 'jsonSchema7',
  $refStrategy: 'none',
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>

export const authenticateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authenticateJsonSchema = zodToJsonSchema(authenticateSchema, {
  target: 'jsonSchema7',
  $refStrategy: 'none',
})

export type AuthenticateInput = z.infer<typeof authenticateSchema>

export const authenticateResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    created_at: z.string().datetime(),
  }),
})

export const authenticateResponseJsonSchema = zodToJsonSchema(
  authenticateResponseSchema,
  {
    target: 'jsonSchema7',
    $refStrategy: 'none',
  },
)

export type AuthenticateResponse = z.infer<typeof authenticateResponseSchema>

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  created_at: z.string().datetime(),
})

export const userJsonSchema = zodToJsonSchema(userSchema, {
  target: 'jsonSchema7',
  $refStrategy: 'none',
})
export type User = z.infer<typeof userSchema>

export const userResponseSchema = z.object({
  user: userSchema,
})
export const userResponseJsonSchema = zodToJsonSchema(userResponseSchema, {
  target: 'jsonSchema7',
  $refStrategy: 'none',
})
export type UserResponse = z.infer<typeof userResponseSchema>
