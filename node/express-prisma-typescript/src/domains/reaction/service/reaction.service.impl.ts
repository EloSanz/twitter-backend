import { ReactionType } from '@prisma/client'
import { ReactionRepository } from '../repository/reaction.repository'
import { ReactionService } from './reaction.service'
import { ReactionDto } from '../dto/reactionDto'
import { isValidReactionType } from '@utils/validation'
import { ConflictException, NotFoundException } from '@utils/errors'
import { PostRepository } from '@domains/post/repository'
import { UserRepository } from '@domains/user/repository'

export class ReactionServiceImpl implements ReactionService {
  constructor (
    private readonly repository: ReactionRepository,
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository
  ) {}

  async addReaction (userId: string, postId: string, type: ReactionType): Promise<ReactionDto> {
    if (!isValidReactionType(type)) { throw new ConflictException('Invalid reaction type') }
    const postExists: boolean = await this.postRepository.existById(postId)
    if (!postExists) { throw new NotFoundException('Post') }
    return await this.repository.addReaction(postId, userId, type)
  }

  async removeReaction (userId: string, postId: string, type: ReactionType): Promise<void> {
    if (!isValidReactionType(type)) { throw new ConflictException('Invalid reaction type:') }

    await this.repository.removeReaction(postId, userId, type)
  }

  async getRetweetsByUser (userId: string): Promise<ReactionDto[]> {
    if (!(await this.userRepository.existById(userId))) { throw new NotFoundException('User') }

    return await this.repository.findByUserAndType(userId, ReactionType.RETWEET)
  }

  async getLikesByUser (userId: string): Promise<ReactionDto[]> {
    if (!(await this.userRepository.existById(userId))) { throw new NotFoundException('User') }

    return await this.repository.findByUserAndType(userId, ReactionType.LIKE)
  }
}
