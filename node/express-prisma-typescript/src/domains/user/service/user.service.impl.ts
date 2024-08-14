import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { ImageService } from './image.service'
import { FollowerRepositoryImpl } from '@domains/follower/repository/follower.repository.impl'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository,
    private readonly imageService: ImageService,
    private readonly followerRepository: FollowerRepositoryImpl
  ) {}

  async sumar (n1: number, n2: number): Promise<number> {
    return n1 + n2
  }

  async getUser (userId: string): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getUserRecommendations (userId: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.repository.getRecommendedUsersPaginated(userId, options)
  }

  async getByUsername (username: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    return await this.repository.getByUsername(username, options)
  }

  async deleteUser (userId: string): Promise<void> {
    await this.repository.delete(userId)
  }

  // Task N° 2
  async setPublicPosts (userId: string): Promise<void> {
    await this.repository.setPublicPosts(userId)
  }

  async setPrivatePosts (userId: string): Promise<void> {
    await this.repository.setPrivatePosts(userId)
  }

  async isFollowing (followedId: string, followerId: string): Promise<boolean> {
    return await this.followerRepository.isFollowing(followerId, followedId)
  }

  async getUserProfilePictureUrl (userId: string): Promise <string | null> {
    const user: boolean = await this.repository.existById(userId)
    if (!user) throw new NotFoundException('user')
    return await this.imageService.getUserProfilePictureUrl(userId)
  }

  async generateUploadUrl (userId: string): Promise<{ uploadUrl: string, key: string }> {
    return await this.imageService.generateUploadUrl(userId)
  }

  async generateDownloadUrl (key: string): Promise<string> {
    return await this.imageService.generateDownloadUrl(key)
  }

  async updateUserProfilePicture (userId: string, key: string, uploadUrl: string, buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    const user: boolean = await this.repository.existById(userId)
    if (!user) throw new NotFoundException('user')
    return await this.imageService.uploadImageWithUrlAndKey(userId, key, uploadUrl, buffer, originalName, mimeType)
  }
}
