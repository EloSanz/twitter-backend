import { OffsetPagination } from '@types'
import { UserViewDTO } from '../dto'
import { Readable } from 'stream'

export interface UserService {
  getUserProfilePictureUrl: (userId: string) => Promise<string | null>
  deleteUser: (userId: string) => Promise<void>
  getUser: (userId: string) => Promise<UserViewDTO>
  getUserRecommendations: (userId: string, options: OffsetPagination) => Promise<UserViewDTO[]>
  setPublicPosts: (userId: string) => Promise<void>
  setPrivatePosts: (userId: string) => Promise<void>
  getImage: (key: string) => Promise<Readable>
  generateUploadUrl: (userId: string) => Promise<{ uploadUrl: string, key: string }>
  generateDownloadUrl: (key: string) => Promise<string>
  updateUserProfilePicture: (userId: string, key: string, updateUrl: string, buffer: Buffer, originalname: string, mimetype: string) => Promise <string | null>
  isFollowing: (followedId: string, followerId: string) => Promise<boolean>
}
