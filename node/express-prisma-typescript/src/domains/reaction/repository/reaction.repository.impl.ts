import { PrismaClient, ReactionType } from '@prisma/client'
import { ReactionRepository } from './reaction.repository'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async addReaction (postId: string, userId: string, type: ReactionType): Promise<void> {
    await this.db.reaction.create({
      data: { postId, userId, type }
    })
  }

  async removeReaction (postId: string, userId: string, type: ReactionType): Promise<void> {
    await this.db.reaction.deleteMany({
      where: { postId, userId, type }
    })
  }
}
