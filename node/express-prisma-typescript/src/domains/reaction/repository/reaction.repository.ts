import { ReactionType } from '@prisma/client'
import { ReactionDto } from '../dto/reactionDto'

export interface ReactionRepository {
  findByUserAndType: (userId: string, type: ReactionType) => Promise<ReactionDto[]>
  addReaction: (postId: string, userId: string, type: ReactionType) => Promise<void>
  removeReaction: (postId: string, userId: string, type: ReactionType) => Promise<void>
}
