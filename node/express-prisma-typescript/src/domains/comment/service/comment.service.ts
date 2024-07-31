import { CommentDto } from '../dto/comment.dto'

export interface CommentService {
  getCommentsByUser: (userId: string) => Promise<CommentDto[]>
  addComment: (postId: string, userId: string, content: string) => Promise<void>
  getCommentsByPost: (postId: string) => Promise<CommentDto[]>

}
