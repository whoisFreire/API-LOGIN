import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const table = await knex('sqlite_schema').select('*')
    return table
  })
}
