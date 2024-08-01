import { OffsetPagination } from '@types'
import { UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  publicPosts: (userId: any) => Promise<void>
  privatePosts: (userId: any) => Promise<void>
}
