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
/// //////////////////////////////////////////
export class Reaction {
  id: string
  type: string
  createdAt: Date
  userId: string
  postId: string
  updatedAt: Date
  deletedAt?: Date

  constructor (reaction: Reaction) {
    this.id = reaction.id
    this.type = reaction.type
    this.createdAt = reaction.createdAt
    this.userId = reaction.userId
    this.postId = reaction.postId
    this.updatedAt = reaction.updatedAt
    this.deletedAt = reaction.deletedAt
  }
}
