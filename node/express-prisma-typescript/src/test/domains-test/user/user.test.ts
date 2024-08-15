import { UserViewDTO } from '@domains/user/dto'
import { UserServiceImpl } from '@domains/user/service/user.service.impl'
import { mockUserRepository, mockImageService, mockFollowerRepository } from '@test/utils'
import { OffsetPagination } from '@types'
import { ConflictException, NotFoundException } from '@utils'

describe('UserServiceImpl', () => {
  let userService: UserServiceImpl

  beforeEach(() => {
    userService = new UserServiceImpl(
      mockUserRepository,
      mockImageService,
      mockFollowerRepository
    )
  })

  describe('sumar', () => {
    it('should return the sum of two numbers', async () => {
      const result = await userService.sumar(2, 3)
      expect(result).toBe(5)
    })

    it('should handle negative numbers', async () => {
      const result = await userService.sumar(-2, -3)
      expect(result).toBe(-5)
    })

    it('should handle mixed positive and negative numbers', async () => {
      const result = await userService.sumar(2, -3)
      expect(result).toBe(-1)
    })
  })
  describe('getUser', () => {
    it('should return the user if it exists', async () => {
      const mockUser: UserViewDTO = {
        id: '123',
        name: 'John Doe',
        username: 'johndoe',
        profilePicture: 'url/to/profile/picture',
        publicPosts: true
      };

      (mockUserRepository.getById as jest.Mock).mockResolvedValue(mockUser)

      const result = await userService.getUser('123')
      expect(result).toEqual(mockUser)
      expect(mockUserRepository.getById).toHaveBeenCalledWith('123')
    })

    it('should throw NotFoundException if user does not exist', async () => {
      (mockUserRepository.getById as jest.Mock).mockResolvedValue(null)

      await expect(userService.getUser('123')).rejects.toThrow(NotFoundException)
      expect(mockUserRepository.getById).toHaveBeenCalledWith('123')
    })
  })
  describe('getUserRecommendations', () => {
    const userId = 'user123'
    const options: OffsetPagination = { skip: 0, limit: 10 }

    beforeEach(() => {
      (mockUserRepository.getRecommendedUsersPaginated as jest.Mock).mockReset()
    })

    it('should return an empty array if no recommendations are found', async () => {
      const mockRecommendedUsers: UserViewDTO[] = [];

      (mockUserRepository.getRecommendedUsersPaginated as jest.Mock).mockResolvedValue(mockRecommendedUsers)

      const result = await userService.getUserRecommendations(userId, options)

      expect(mockUserRepository.getRecommendedUsersPaginated).toHaveBeenCalledWith(userId, options)
      expect(result).toEqual(mockRecommendedUsers)
    })
  })
  describe('getByUsername', () => {
    it('should return users for a given username', async () => {
      const mockUsers: UserViewDTO[] = [
        { id: '1', name: 'User One', username: 'userone', profilePicture: 'url1', publicPosts: true },
        { id: '2', name: 'User Two', username: 'usertwo', profilePicture: 'url2', publicPosts: false }
      ]
      const username = 'userone'
      const options: OffsetPagination = { skip: 0, limit: 10 };

      (mockUserRepository.getByUsername as jest.Mock).mockResolvedValue(mockUsers)

      const result = await userService.getByUsername(username, options)
      expect(result).toEqual(mockUsers)
      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith(username, options)
    })

    it('should return an empty array if no users are found', async () => {
      const mockUsers: UserViewDTO[] = []
      const username = 'nonexistentuser'
      const options: OffsetPagination = { skip: 0, limit: 10 };

      (mockUserRepository.getByUsername as jest.Mock).mockResolvedValue(mockUsers)

      const result = await userService.getByUsername(username, options)
      expect(result).toEqual(mockUsers)
      expect(mockUserRepository.getByUsername).toHaveBeenCalledWith(username, options)
    })
  })
  describe('setPublicPosts & setPrivatePosts with getUser', () => {
    const userId = '123'

    it('should set user posts to public and return user with publicPosts set to true', async () => {
      const mockUser: UserViewDTO = {
        id: userId,
        name: 'Test User',
        username: 'testuser',
        profilePicture: 'profileUrl',
        publicPosts: true
      };

      (mockUserRepository.getById as jest.Mock).mockResolvedValue(mockUser);
      (mockUserRepository.setPublicPosts as jest.Mock).mockResolvedValue(undefined)

      await userService.setPublicPosts(userId)
      const user = await userService.getUser(userId)

      expect(mockUserRepository.setPublicPosts).toHaveBeenCalledWith(userId)
      expect(user.publicPosts).toBe(true)
    })

    it('should set user posts to private and return user with publicPosts set to false', async () => {
      const mockUser: UserViewDTO = {
        id: userId,
        name: 'Test User',
        username: 'testuser',
        profilePicture: 'profileUrl',
        publicPosts: false
      };

      // Mock repository methods
      (mockUserRepository.getById as jest.Mock).mockResolvedValue(mockUser);
      (mockUserRepository.setPrivatePosts as jest.Mock).mockResolvedValue(undefined)

      await userService.setPrivatePosts(userId)
      const user = await userService.getUser(userId)

      expect(mockUserRepository.setPrivatePosts).toHaveBeenCalledWith(userId)
      expect(user.publicPosts).toBe(false)
    })
  })
  describe('isFollowing', () => {
    it('should return true if the follower is following the followed user', async () => {
      const followedId = 'followedUserId'
      const followerId = 'followerUserId';

      (mockFollowerRepository.isFollowing as jest.Mock).mockResolvedValue(true)

      const result = await userService.isFollowing(followedId, followerId)

      expect(result).toBe(true)
      expect(mockFollowerRepository.isFollowing).toHaveBeenCalledWith(followerId, followedId)
    })

    it('should return false if the follower is not following the followed user', async () => {
      const followedId = 'followedUserId'
      const followerId = 'followerUserId';

      (mockFollowerRepository.isFollowing as jest.Mock).mockResolvedValue(false)

      const result = await userService.isFollowing(followedId, followerId)

      expect(result).toBe(false)
      expect(mockFollowerRepository.isFollowing).toHaveBeenCalledWith(followerId, followedId)
    })

    it('should throw ConflictException if a user tries to follow themselves', async () => {
      const userId = 'userId'

      await expect(userService.isFollowing(userId, userId)).rejects.toThrow(ConflictException)
    })
  })
  describe('getUserProfilePictureUrl', () => {
    it('should return the user profile picture URL if user exists', async () => {
      const userId = 'userId'
      const profilePictureUrl = 'http://example.com/pic.jpg';

      (mockUserRepository.existById as jest.Mock).mockResolvedValue(true);
      (mockImageService.getUserProfilePictureUrl as jest.Mock).mockResolvedValue(profilePictureUrl)

      const result = await userService.getUserProfilePictureUrl(userId)

      expect(result).toBe(profilePictureUrl)
      expect(mockUserRepository.existById).toHaveBeenCalledWith(userId)
      expect(mockImageService.getUserProfilePictureUrl).toHaveBeenCalledWith(userId)
    })

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 'userId';

      (mockUserRepository.existById as jest.Mock).mockResolvedValue(false)

      await expect(userService.getUserProfilePictureUrl(userId)).rejects.toThrow(NotFoundException)
      expect(mockUserRepository.existById).toHaveBeenCalledWith(userId)
    })
  })

  describe('generateUploadUrl', () => {
    it('should return upload URL and key', async () => {
      const userId = 'userId'
      const uploadUrl = 'http://example.com/upload'
      const key = 'some-key';

      (mockImageService.generateUploadUrl as jest.Mock).mockResolvedValue({ uploadUrl, key })

      const result = await userService.generateUploadUrl(userId)

      expect(result).toEqual({ uploadUrl, key })
      expect(mockImageService.generateUploadUrl).toHaveBeenCalledWith(userId)
    })
  })

  describe('generateDownloadUrl', () => {
    it('should return the download URL for the given key', async () => {
      const key = 'some-key'
      const downloadUrl = 'http://example.com/download';

      (mockImageService.generateDownloadUrl as jest.Mock).mockResolvedValue(downloadUrl)

      const result = await userService.generateDownloadUrl(key)

      expect(result).toBe(downloadUrl)
      expect(mockImageService.generateDownloadUrl).toHaveBeenCalledWith(key)
    })
  })

  describe('updateUserProfilePicture', () => {
    it('should update user profile picture if user exists', async () => {
      const userId = 'userId'
      const key = 'some-key'
      const uploadUrl = 'http://example.com/upload'
      const buffer = Buffer.from('test')
      const originalName = 'picture.jpg'
      const mimeType = 'image/jpeg'
      const updatedPictureUrl = 'http://example.com/pic.jpg';

      (mockUserRepository.existById as jest.Mock).mockResolvedValue(true);
      (mockImageService.uploadImageWithUrlAndKey as jest.Mock).mockResolvedValue(updatedPictureUrl)

      const result = await userService.updateUserProfilePicture(userId, key, uploadUrl, buffer, originalName, mimeType)

      expect(result).toBe(updatedPictureUrl)
      expect(mockUserRepository.existById).toHaveBeenCalledWith(userId)
      expect(mockImageService.uploadImageWithUrlAndKey).toHaveBeenCalledWith(userId, key, uploadUrl, buffer, originalName, mimeType)
    })

    it('should throw NotFoundException if user does not exist', async () => {
      const userId = 'userId'
      const key = 'some-key'
      const uploadUrl = 'http://example.com/upload'
      const buffer = Buffer.from('test')
      const originalName = 'picture.jpg'
      const mimeType = 'image/jpeg';

      (mockUserRepository.existById as jest.Mock).mockResolvedValue(false)

      await expect(userService.updateUserProfilePicture(userId, key, uploadUrl, buffer, originalName, mimeType)).rejects.toThrow(NotFoundException)
      expect(mockUserRepository.existById).toHaveBeenCalledWith(userId)
    })
  })
})
