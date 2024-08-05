import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { ImageService } from './image.service'
import { Readable } from 'stream'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository,
    private readonly imageService: ImageService
  ) {}

  async getUser (userId: any): Promise<UserViewDTO> {
    const user = await this.repository.getById(userId)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.repository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  // Task N° 2
  async setPublicPosts (userId: string): Promise<void> {
    await this.repository.publicPosts(userId)
  }

  async setPrivatePosts (userId: string): Promise<void> {
    await this.repository.privatePosts(userId)
  }

  async getUserProfilePictureUrl (userId: string): Promise <string | null> {
    const user: boolean = await this.repository.existById(userId)
    if (!user) throw new NotFoundException('user')
    return await this.imageService.getUserProfilePictureUrl(userId)
  }

  async getImage (key: string): Promise<Readable> {
    return await this.imageService.getImage(key)
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
