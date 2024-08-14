import { FollowerRepositoryImpl } from '@domains/follower/repository/follower.repository.impl'
import { UserViewDTO } from '@domains/user/dto'
import { UserRepository } from '@domains/user/repository'
import { ImageService } from '@domains/user/service/image.service'
import { UserServiceImpl } from '@domains/user/service/user.service.impl'
import { OffsetPagination } from '@types'
import { NotFoundException } from '@utils'

describe('UserServiceImpl', () => {
  let userService: UserServiceImpl

  const mockUserRepository: UserRepository = {
    getById: jest.fn(),
    getRecommendedUsersPaginated: jest.fn(),
    getByUsername: jest.fn(),
    delete: jest.fn(),
    setPublicPosts: jest.fn(),
    setPrivatePosts: jest.fn(),
    existById: jest.fn()
  } as unknown as UserRepository

  const mockImageService: ImageService = {
    getUserProfilePictureUrl: jest.fn(),
    generateUploadUrl: jest.fn(),
    generateDownloadUrl: jest.fn(),
    uploadImageWithUrlAndKey: jest.fn()
  } as unknown as ImageService

  const mockFollowerRepository: FollowerRepositoryImpl = {
    isFollowing: jest.fn()
  } as unknown as FollowerRepositoryImpl

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
})
