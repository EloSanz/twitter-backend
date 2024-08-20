import { ReactionType } from '@prisma/client'

export interface RemoveReactionDto {
  postId: string
  type: ReactionType
}

export class ReactionDto {
  id: string
  postId: string
  userId: string
  type: ReactionType

  constructor (reaction: { id: string, postId: string, userId: string, type: ReactionType }) {
    this.id = reaction.id
    this.postId = reaction.postId
    this.userId = reaction.userId
    this.type = reaction.type
  }
}
