import { CursorPagination } from '@types'
import { CommentDto } from '../dto/comment.dto'
import { ExtendedPostDTO } from '@domains/post/dto'

export interface CommentService {
  getCommentsByUser: (userId: string) => Promise<CommentDto[]>
  addComment: (postId: string, userId: string, content: string, images: string[]) => Promise<CommentDto>
  getCommentsByPostId: (postId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>
  getCommentCount: (postId: string) => Promise<number>
}
