import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  update: (userId: string, imageUrl: string) => Promise <UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserViewDTO[]>
  getById: (userId: string) => Promise<UserViewDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  getByUsername: (username: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  // Task N° 2
  getPublicPostAuthors: () => Promise<string[]>
  privatePosts: (userId: string) => Promise<void>
  publicPosts: (userId: string) => Promise<void>
  isPublicById: (userId: string) => Promise<boolean>
  existById: (userId: string) => Promise<boolean>
}
