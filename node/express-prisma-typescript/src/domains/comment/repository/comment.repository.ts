import { CommentDto } from '../dto/comment.dto'

export interface CommentRepository {
  findByUser: (userId: string) => Promise<CommentDto[]>
  createComment: (postId: string, userId: string, content: string) => Promise <void>
  getCommentsByPostId: (postId: string) => Promise <CommentDto[]>
}
