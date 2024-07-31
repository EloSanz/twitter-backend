import { ReactionType } from '@prisma/client'

export interface ReactionService {
  addReaction: (userId: string, postId: string, type: ReactionType) => Promise<void>
  removeReaction: (userId: string, postId: string, type: ReactionType) => Promise<void>
}
