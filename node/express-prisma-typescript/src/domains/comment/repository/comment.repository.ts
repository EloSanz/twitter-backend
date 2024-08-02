import { ExtendedPostDTO } from '@domains/post/dto'
import { CursorPagination } from '@types'
import { CommentDto } from '../dto/comment.dto'

export interface CommentRepository {
  findByUser: (userId: string) => Promise<CommentDto[]>
  createComment: (postId: string, userId: string, content: string) => Promise <CommentDto>
  getCommentsByPostId: (postId: string, options: CursorPagination) => Promise <ExtendedPostDTO[]>
}
