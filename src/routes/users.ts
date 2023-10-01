import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/create', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      email,
      hash_password: password,
    })

    return reply.status(201).send()
  })

  app.post('/login', async (request) => {
    const getUserParamsSchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = getUserParamsSchema.parse(request.body)

    const data = await knex('users')
      .where({ email, hash_password: password })
      .first()

    const returnUserData = z.object({
      id: z.string().uuid(),
      email: z.string(),
      hash_password: z.string(),
      created_at: z.string(),
    })

    const user = returnUserData.parse(data)

    return {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    }
  })
}
