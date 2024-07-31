import { ReactionType } from '@prisma/client'
import { ReactionDto } from '../dto/reactionDto'

export interface ReactionService {
  addReaction: (userId: string, postId: string, type: ReactionType) => Promise<void>
  removeReaction: (userId: string, postId: string, type: ReactionType) => Promise<void>
  getRetweetsByUser: (userId: string) => Promise<ReactionDto[]>
  getLikesByUser: (userId: string) => Promise<ReactionDto[]>
}
