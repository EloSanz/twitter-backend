import { CursorPagination } from '@types'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (userId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>
  getRecommendedPaginated: (userId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>
  getFollowingPosts: (userId: string, options: CursorPagination) => Promise<ExtendedPostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByUserId: (authorId: string) => Promise<ExtendedPostDTO[]>
  existById: (postId: string) => Promise<boolean>
}
