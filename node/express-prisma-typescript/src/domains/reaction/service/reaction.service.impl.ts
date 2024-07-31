import { ReactionType } from '@prisma/client'
import { ReactionRepository } from '../repository/reaction.repository'
import { ReactionService } from './reaction.service'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  async addReaction (userId: string, postId: string, type: ReactionType): Promise<void> {
    await this.repository.addReaction(postId, userId, type)
  }

  async removeReaction (userId: string, postId: string, type: ReactionType): Promise<void> {
    await this.repository.removeReaction(postId, userId, type)
  }
}
