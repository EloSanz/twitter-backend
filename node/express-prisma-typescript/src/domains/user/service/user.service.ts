import { OffsetPagination } from '@types'
import { UserViewDTO } from '../dto'

export interface UserService {
  getUserProfilePictureUrl: (userId: string) => Promise <string | null>
  updateUserProfilePicture: (userId: string, buffer: Buffer, originalname: string, mimetype: string) => Promise <string | null>
  deleteUser: (userId: string) => Promise<void>
  getUser: (userId: string) => Promise<UserViewDTO>
  getUserRecommendations: (userId: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  publicPosts: (userId: string) => Promise<void>
  privatePosts: (userId: string) => Promise<void>
}
