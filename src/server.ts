import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  const table = await knex('sqlite_schema').select('*')
  return table
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log('Server is running🚀'))
