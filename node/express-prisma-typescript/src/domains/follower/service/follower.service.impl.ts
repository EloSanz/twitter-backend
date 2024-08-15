import { ConflictException, NotFoundException } from '@utils/errors'
import { FollowerRepository } from '../repository/follower.repository'
import { FollowerService } from './follower.service'
import { UserRepository } from '@domains/user/repository'

export class FollowerServiceImpl implements FollowerService {
  constructor (
    private readonly repository: FollowerRepository,
    private readonly userRepository: UserRepository
  ) {}

  private async ensureUserExists (userId: string): Promise<void> {
    const userExists: boolean = await this.userRepository.existById(userId)
    if (!userExists) { throw new NotFoundException('User does not exist') }
  }

  async isFollowing (followerId: string, followedId: string): Promise<boolean> {
    return await this.repository.isFollowing(followerId, followedId)
  }

  async follow (followerId: string, followedId: string): Promise<void> {
    if (followerId === followedId) { throw new ConflictException('Cannot follow yourself') }
    await this.ensureUserExists(followedId)

    const alreadyFollowing = await this.repository.isFollowing(followerId, followedId)
    if (alreadyFollowing) { throw new ConflictException('User already followed') }

    await this.repository.follow(followerId, followedId)
  }

  async unfollow (followerId: string, followedId: string): Promise<void> {
    if (followerId === followedId) { throw new ConflictException('Cannot unfollow yourself') }

    await this.ensureUserExists(followedId)
    await this.repository.unfollow(followerId, followedId)
  }

  async getUserFollowers (userId: string): Promise<string[]> {
    await this.ensureUserExists(userId)
    return await this.repository.getFollowersUserIds(userId)
  }

  async getUserFollowed (userId: string): Promise<string[]> {
    await this.ensureUserExists(userId)
    return await this.repository.getFollowedUserIds(userId)
  }
}
