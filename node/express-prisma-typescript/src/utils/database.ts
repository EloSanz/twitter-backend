import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient()

export async function userExists (userId: string): Promise<boolean> {
  const count = await db.user.count({ where: { id: userId } })
  return count > 0
}
