import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserDTO[]>
  getById: (userId: string) => Promise<UserDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  // Task N° 2
  getPublicPostAuthors: () => Promise<string[]>
  privatePosts: (userId: string) => Promise<void>
  publicPosts: (userId: string) => Promise<void>
  isPublicById: (userId: string) => Promise<boolean>
  existById: (userId: string) => Promise<boolean>
}
