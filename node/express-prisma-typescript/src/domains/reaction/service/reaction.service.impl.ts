import { ReactionType } from '@prisma/client'
import { ReactionRepository } from '../repository/reaction.repository'
import { ReactionService } from './reaction.service'
import { ReactionDto } from '../dto/reactionDto'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  async addReaction (userId: string, postId: string, type: ReactionType): Promise<void> {
    await this.repository.addReaction(postId, userId, type)
  }

  async removeReaction (userId: string, postId: string, type: ReactionType): Promise<void> {
    await this.repository.removeReaction(postId, userId, type)
  }

  async getRetweetsByUser (userId: string): Promise<ReactionDto[]> {
    return await this.repository.findByUserAndType(userId, 'RETWEET')
  }

  async getLikesByUser (userId: string): Promise<ReactionDto[]> {
    return await this.repository.findByUserAndType(userId, 'LIKE')
  }
}
