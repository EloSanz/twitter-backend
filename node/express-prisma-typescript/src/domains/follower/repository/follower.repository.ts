
export interface FollowerRepository {
  follow: (followerId: string, followedId: string) => Promise<void>
  unfollow: (followerId: string, followedId: string) => Promise<void>
  getFollowersUserIds: (userId: string) => Promise<string[]>
  isFollowing: (followerId: string, followedId: string) => Promise<boolean>
  getFollowedUserIds: (userId: string) => Promise<string[]>
}
