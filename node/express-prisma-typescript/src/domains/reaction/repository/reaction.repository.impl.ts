import { PrismaClient, ReactionType } from '@prisma/client'
import { ReactionRepository } from './reaction.repository'
import { ReactionDto } from '../dto/reactionDto'
import { ConflictException, NotFoundException } from '@utils/errors'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async addReaction (postId: string, userId: string, type: ReactionType): Promise<ReactionDto> {
    const postExists = await this.db.post.findUnique({
      where: { id: postId }
    })

    if (!postExists) {
      throw new NotFoundException('Post ID does not exist')
    }
    const existingReaction = await this.db.reaction.findUnique({
      where: {
        postId_userId_type: {
          postId,
          userId,
          type
        }
      }
    })

    if (existingReaction) {
      throw new ConflictException(`Reaction of type ${type} already exists`)
    }

    const reaction = await this.db.reaction.create({
      data: {
        postId,
        userId,
        type
      }
    })

    return new ReactionDto(reaction)
  }

  async removeReaction (postId: string, userId: string, type: ReactionType): Promise<void> {
    await this.db.reaction.deleteMany({
      where: { postId, userId, type }
    })
  }

  async findByUserAndType (userId: string, type: ReactionType): Promise<ReactionDto[]> {
    const reactions = await this.db.reaction.findMany({
      where: {
        userId,
        type
      }
    })
    return reactions.map(reaction => ({
      id: reaction.id,
      postId: reaction.postId,
      userId: reaction.userId,
      type: reaction.type
    }))
  }
}
