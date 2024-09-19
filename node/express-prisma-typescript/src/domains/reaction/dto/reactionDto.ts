import { ReactionType } from '@prisma/client'

export interface RemoveReactionDto {
  postId: string
  type: ReactionType
}

export class ReactionDto {
  id: string
  userId: string
  postId: string
  type: ReactionType

  constructor (reaction: ReactionDto) {
    this.id = reaction.id
    this.userId = reaction.userId
    this.postId = reaction.postId
    this.type = reaction.type
  }
}
/// //////////////////////////////////////////
export class Reaction {
  id: string
  type: string
  userId: string
  postId: string

  constructor (reaction: Reaction) {
    this.id = reaction.id
    this.type = reaction.type
    this.userId = reaction.userId
    this.postId = reaction.postId
  }
}
