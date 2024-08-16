import { FollowerServiceImpl } from '@domains/follower/service'
import { mockUserRepository, mockFollowerRepository } from '@test/utils'
import { NotFoundException, ConflictException } from '@utils'

describe('FollowerServiceImpl', () => {
  let followerService: FollowerServiceImpl

  beforeEach(() => {
    followerService = new FollowerServiceImpl(
      mockFollowerRepository,
      mockUserRepository
    )
  })
  describe('iFollowing', () => {
    it('should return true when a user follows another user', async () => {
      const followerId = 'followerId'
      const followedId = 'followedId'
      mockFollowerRepository.isFollowing.mockResolvedValue(true)
      const isFollowing = await followerService.isFollowing(followerId, followedId)
      expect(isFollowing).toBe(true)
    })
  })
  describe('unfollow', () => {
    it('should throw NotFoundException when the user does not exist', async () => {
      const followerId = 'followerId'
      const followedId = 'followedId'
      mockUserRepository.existById.mockResolvedValue(false)

      await expect(followerService.unfollow(followerId, followedId)).rejects.toThrow(NotFoundException)
    })
    it('should throw ConflictException when a user tries to unfollow themself', async () => {
      const followerId = 'followerId';
      (mockUserRepository.existById as jest.Mock).mockResolvedValue(true)
      await expect(followerService.unfollow(followerId, followerId)).rejects.toThrow(ConflictException)
    })
  })
  describe('follow', () => {
    it('should throw NotFoundException when the user does not exist', async () => {
      const followerId = 'followerId'
      const followedId = 'followedId'
      mockUserRepository.existById.mockResolvedValue(false)

      await expect(followerService.follow(followerId, followedId)).rejects.toThrow(NotFoundException)
    })
    it('should throw ConflictException when a user tries to follow themself', async () => {
      const followerId = 'followerId'
      mockUserRepository.existById.mockResolvedValue(true)
      await expect(followerService.follow(followerId, followerId)).rejects.toThrow(ConflictException)
    })
  })
})
