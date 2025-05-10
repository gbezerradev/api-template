import { test, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/core/lib/prisma'

beforeAll(async () => {
  await app.ready()
})

beforeEach(async () => {
  // Clean database before each test
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await app.close()
})

test('should register a new user', async () => {
  const response = await request(app.server).post('/register').send({
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
  })

  expect(response.statusCode).toBe(201)
})
