import { ConflictException, NotFoundException } from '@utils/errors'
import { FollowerRepository } from '../repository/follower.repository'
import { FollowerService } from './follower.service'
import { UserRepository } from '@domains/user/repository'

export class FollowerServiceImpl implements FollowerService {
  constructor (
    private readonly repository: FollowerRepository,
    private readonly userRepository: UserRepository
  ) {}

  async follow (followerId: string, followedId: string): Promise<void> {
    if (followerId === followedId) {
      throw new ConflictException('Cannot follow yourself')
    }

    const followedUserExists = await this.userRepository.getById(followedId)
    if (!followedUserExists) {
      throw new NotFoundException('User to follow does not exist')
    }

    const alreadyFollowing = await this.repository.isFollowing(followerId, followedId)
    if (alreadyFollowing) {
      throw new ConflictException('User already followed')
    }
    await this.repository.follow(followerId, followedId)
  }

  async unfollow (followerId: string, followedId: string): Promise<void> {
    await this.repository.unfollow(followerId, followedId)
  }

  async getUserFollowers (userId: string): Promise<any[]> {
    return await this.repository.findByUserId(userId)
  }
}
