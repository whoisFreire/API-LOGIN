import { env } from '../env'
import bcrypt from 'bcrypt'

interface comparePasswordData {
  password: string
  hash: string
}

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, Number(env.SALT_ROUNDS))
  return hash
}

export const comparePassword = async (data: comparePasswordData) => {
  const result = await bcrypt.compare(data.password, data.hash)
  return result
}
