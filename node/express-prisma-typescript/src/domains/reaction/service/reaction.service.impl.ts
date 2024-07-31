import { ReactionType } from '@prisma/client'
import { ReactionRepository } from '../repository/reaction.repository'
import { ReactionService } from './reaction.service'
import { ReactionDto } from '../dto/reactionDto'
import { isValidReactionType } from '@utils/validation'
import { ConflictException, NotFoundException } from '@utils/errors'
import { isEmpty } from 'class-validator'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  async addReaction (userId: string, postId: string, type: ReactionType): Promise<ReactionDto> {
    if (isEmpty(postId)) { throw new NotFoundException('Post ID not provided') }

    if (!isValidReactionType(type)) {
      throw new ConflictException('Invalid reaction type')
    }

    const reaction = await this.repository.addReaction(postId, userId, type)

    return new ReactionDto(reaction)
  }

  async removeReaction (userId: string, postId: string, type: ReactionType): Promise<void> {
    await this.repository.removeReaction(postId, userId, type)
  }

  async getRetweetsByUser (userId: string): Promise<ReactionDto[]> {
    return await this.repository.findByUserAndType(userId, ReactionType.RETWEET)
  }

  async getLikesByUser (userId: string): Promise<ReactionDto[]> {
    return await this.repository.findByUserAndType(userId, ReactionType.LIKE)
  }
}
