import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserProfile, UserViewDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  update: (userId: string, imageUrl: string) => Promise <UserDTO>
  delete: (userId: string) => Promise<void>
  softDelete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (userId: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  getById: (userId: string) => Promise<UserViewDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  // getByEmailOrUsernameRegister: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  getByUsername: (userId: string, username: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  // Task N° 2
  getPublicPostAuthors: () => Promise<string[]>
  setPrivatePosts: (userId: string) => Promise<void>
  setPublicPosts: (userId: string) => Promise<void>
  isPublicById: (userId: string) => Promise<boolean>
  existById: (userId: string) => Promise<boolean>
  /// ///////////////////////////////////////////
  getUserProfile: (userId: string) => Promise<UserProfile>
}
