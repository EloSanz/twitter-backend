import { ReactionType } from '@prisma/client'

export interface AddReactionDto {
  postId: string
  type: ReactionType
}

export interface RemoveReactionDto {
  postId: string
  type: ReactionType
}

export interface ReactionDto {
  id: string
  postId: string
  userId: string
  type: ReactionType
}
