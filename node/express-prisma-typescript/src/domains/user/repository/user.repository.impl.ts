import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user
      .create({
        data
      })
      .then((user) => new UserDTO(user))
  }

  async update (userId: string, imageUrl: string): Promise<UserDTO> {
    return await this.db.user
      .update({
        where: { id: userId },
        data: { profilePicture: imageUrl }
      })
  }

  async getById (userId: string): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
        deletedAt: null
      }
    })
    return user ? new UserViewDTO(user) : null
  }

  async softDelete (userId: string): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        deletedAt: new Date()
      }
    })
    const userWithMessages = await this.db.user.findUnique({
      where: { id: userId },
      include: { sentMessages: true, receivedMessages: true }
    })

    if (userWithMessages && (userWithMessages.sentMessages.length > 0 || userWithMessages.receivedMessages.length > 0)) {
      await this.db.message.updateMany({
        where: { senderId: userId },
        data: { deletedAt: new Date() }
      })
      await this.db.message.updateMany({
        where: { receiverId: userId },
        data: { deletedAt: new Date() }
      })
    }
  }

  async delete (userId: string): Promise<void> {
    try {
      const userWithMessages = await this.db.user.findUnique({
        where: { id: userId },
        include: { sentMessages: true, receivedMessages: true }
      })

      if (userWithMessages && (userWithMessages.sentMessages.length > 0 || userWithMessages.receivedMessages.length > 0)) {
        await this.db.message.deleteMany({
          where: { senderId: userId }
        })
        await this.db.message.deleteMany({
          where: { receiverId: userId }
        })
      }

      await this.db.user.delete({
        where: {
          id: userId
        }
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  async getUserFollowing (userId: string): Promise<string[]> {
    const followRecords = await this.db.follow.findMany({
      where: { followerId: userId },
      select: { followedId: true }
    })
    return followRecords.map(record => record.followedId)
  }

  async getUsersFollowedByFollowingUsers (userIds: string[]): Promise<string[]> {
    const followedUsersRecords = await this.db.follow.findMany({
      where: { followerId: { in: userIds } },
      select: { followedId: true },
      distinct: ['followedId']
    })
    return followedUsersRecords.map(record => record.followedId)
  }

  async getRecommendedUsersPaginated (userId: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    const followingIds = await this.getUserFollowing(userId)
    const followedByFollowingUserIds = await this.getUsersFollowedByFollowingUsers(followingIds)

    const recommendedUserIds = followedByFollowingUserIds.filter(id => id !== userId)

    const users = await this.db.user.findMany({
      where: { id: { in: recommendedUserIds } },
      skip: options.skip ? options.skip : undefined,
      take: options.limit ? options.limit : undefined,
      orderBy: { id: 'asc' }
    })

    return users.map(user => new UserViewDTO(user))
  }

  async getByUsername (username: string, options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      where: {
        username: {
          contains: username,
          mode: 'insensitive'
        },
        deletedAt: null
      }
    })
    return users.map((user) => new UserViewDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ],
        deletedAt: null // register is not verifying if user is deleted
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async getByEmailOrUsernameRegister (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        AND: {
          deletedAt: null, // verify
          OR: [
            { email },
            { username }
          ]
        }
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async setPublicPosts (userId: string): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        publicPosts: true
      }
    })
  }

  async setPrivatePosts (userId: string): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        publicPosts: false
      }
    })
  }

  async isPublicById (userId: string): Promise<boolean> {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: { publicPosts: true }
    })
    return user?.publicPosts ?? false
  }

  // Task N° 2
  async getPublicPostAuthors (): Promise<string[]> {
    const users = await this.db.user.findMany({
      where: {
        publicPosts: true
      },
      select: {
        id: true
      }
    })
    return users.map(user => user.id)
  }

  async existById (userId: string): Promise<boolean> {
    const count = await this.db.user.count({
      where: {
        id: userId,
        deletedAt: null
      }
    })
    return count > 0
  }
}
