import { ReactionType } from '@prisma/client'

export interface AddReactionDto {
  postId: string
  type: ReactionType
}

export interface RemoveReactionDto {
  postId: string
  type: ReactionType
}
