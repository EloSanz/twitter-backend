
export interface FollowerRepository {
  follow: (followerId: string, followedId: string) => Promise<void>
  unfollow: (followerId: string, followedId: string) => Promise<void>
  isFollowing: (followerId: string, followedId: string) => Promise<boolean>

  getFollowersUserIds: (userId: string) => Promise<string[]>
  getFollowedUserIds: (userId: string) => Promise<string[]>
}
