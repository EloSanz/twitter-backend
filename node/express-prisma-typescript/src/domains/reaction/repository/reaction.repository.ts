import { ReactionType } from '@prisma/client'

export interface ReactionRepository {
  addReaction: (postId: string, userId: string, type: ReactionType) => Promise<void>
  removeReaction: (postId: string, userId: string, type: ReactionType) => Promise<void>
}
