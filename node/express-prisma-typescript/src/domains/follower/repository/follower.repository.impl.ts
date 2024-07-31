import { PrismaClient, Follow } from '@prisma/client'
import { FollowerRepository } from './follower.repository'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}

  async follow (followerId: string, followedId: string): Promise<void> {
    await this.db.follow.create({
      data: {
        followerId,
        followedId
      }
    })
  }

  async unfollow (followerId: string, followedId: string): Promise<void> {
    await this.db.follow.deleteMany({
      where: {
        followerId,
        followedId
      }
    })
  }

  async findByUserId (userId: string): Promise<Follow[]> {
    return await this.db.follow.findMany({
      where: {
        OR: [
          { followerId: userId },
          { followedId: userId }
        ]
      }
    })
  }

  async isFollowing (followerId: string, followedId: string): Promise<boolean> {
    const existingFollower = await this.db.follow.findFirst({
      where: {
        followerId,
        followedId
      }
    })
    return !!existingFollower
  }

  async getFollowedUserIds (userId: string): Promise<string[]> {
    const follows = await this.db.follow.findMany({
      where: { followerId: userId },
      select: { followedId: true }
    })
    return follows.map(follow => follow.followedId)
  }
}
