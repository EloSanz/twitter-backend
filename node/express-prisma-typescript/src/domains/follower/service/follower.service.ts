
export interface FollowerService {
  follow: (followerId: string, followedId: string) => Promise<void>
  unfollow: (followerId: string, followedId: string) => Promise<void>
  getUserFollowers: (userId: string) => Promise<string[]>
  getUserFollowed: (userId: string) => Promise<string[]>
}
