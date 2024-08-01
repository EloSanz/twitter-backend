import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import { UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

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
  async publicPosts (userId: string): Promise<void> {
    try {
      await this.repository.publicPosts(userId)
    } catch (error) {
      console.error('Error updating public posts:', error)
      throw new Error('Error updating public posts')
    }
  }

  async privatePosts (userId: string): Promise<void> {
    try {
      await this.repository.privatePosts(userId)
    } catch (error) {
      console.error('Error updating private posts:', error)
      throw new Error('Error updating private posts')
    }
  }
}
