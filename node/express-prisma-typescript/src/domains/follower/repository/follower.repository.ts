import { Follow } from '@prisma/client'

export interface FollowerRepository {
  follow: (followerId: string, followedId: string) => Promise<void>
  unfollow: (followerId: string, followedId: string) => Promise<void>
  findByUserId: (userId: string) => Promise<Follow[]>
  isFollowing: (followeId: string, followedId: string) => Promise<boolean>
}
