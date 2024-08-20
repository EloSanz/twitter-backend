import { ReactionDto } from '../dto/reactionDto'

export interface ReactionService {
  addReaction: (userId: string, postId: string, type: string) => Promise<ReactionDto>
  removeReaction: (userId: string, postId: string, type: string) => Promise<void>
  getRetweetsByUser: (userId: string) => Promise<ReactionDto[]>
  getLikesByUser: (userId: string) => Promise<ReactionDto[]>
}
