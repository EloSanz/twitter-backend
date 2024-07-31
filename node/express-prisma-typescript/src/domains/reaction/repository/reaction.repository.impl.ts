import { PrismaClient, ReactionType } from '@prisma/client'
import { ReactionRepository } from './reaction.repository'
import { ReactionDto } from '../dto/reactionDto'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async addReaction (postId: string, userId: string, type: ReactionType): Promise<ReactionDto> {
    const postExists = await this.db.post.findUnique({
      where: { id: postId }
    })

    if (!postExists) {
      throw new Error('Post ID does not exist')
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
