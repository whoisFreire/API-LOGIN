import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { knex } from '../database'
import { comparePassword, hashPassword } from '../utils/hashPassword'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/create', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createUserBodySchema.parse(request.body)

    const hashedPassword = await hashPassword(password)

    await knex('users').insert({
      id: randomUUID(),
      email,
      hash_password: hashedPassword,
    })

    return reply.status(201).send()
  })

  app.post('/login', async (request, reply) => {
    const getUserParamsSchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = getUserParamsSchema.parse(request.body)

    const data = await knex('users').where({ email }).first()

    const returnUserData = z.object({
      id: z.string().uuid(),
      email: z.string(),
      hash_password: z.string(),
      created_at: z.string(),
    })
    const user = returnUserData.parse(data)

    const isCorrectlyPwd = await comparePassword({
      hash: user.hash_password,
      password,
    })

    if (isCorrectlyPwd) {
      return reply.status(200).send({
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      })
    }
    return reply.status(401).send({
      error: 'invalid password or email',
    })
  })
}
