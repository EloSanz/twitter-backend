import { ExtendedPostDTO } from '@domains/post/dto'
import { CursorPagination } from '@types'
import { CommentDto } from '../dto/comment.dto'

export interface CommentRepository {
  getCommentsByUserId: (userId: string) => Promise<CommentDto[]>
  createComment: (postId: string, userId: string, content: string) => Promise <CommentDto>
  getCommentsByPostId: (postId: string, options: CursorPagination) => Promise <ExtendedPostDTO[]>
  getCommentCount: (postId: string) => Promise <number>
  existById: (postId: string) => Promise <boolean>
}
