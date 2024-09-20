import { OffsetPagination } from '@types'
import { Author, UserProfile, UserViewDTO } from '../dto'

export interface UserService {
  softDeleteUser: (userId: string) => Promise<void>
  getUserProfilePictureUrl: (userId: string) => Promise<string | null>
  getUser: (userId: string) => Promise<UserViewDTO>
  getUserRecommendations: (userId: string, options: OffsetPagination) => Promise<UserViewDTO[]>

  getByUsername: (userId: string, username: string, options: OffsetPagination) => Promise<UserViewDTO[]>

  setPublicPosts: (userId: string) => Promise<void>
  setPrivatePosts: (userId: string) => Promise<void>
  generateUploadUrl: (userId: string) => Promise<{ uploadUrl: string, key: string }>
  generateDownloadUrl: (key: string) => Promise<string>
  updateUserProfilePicture: (userId: string, key: string, updateUrl: string, buffer: Buffer, originalname: string, mimetype: string) => Promise <string | null>
  isFollowing: (followedId: string, followerId: string) => Promise<boolean>
  deleteUser: (userId: string) => Promise<void>
  /// ///////////////////////////////////////////
  getUserProfile: (userId: string) => Promise<UserProfile>
  getAuthor: (userId: string) => Promise<Author>
}
