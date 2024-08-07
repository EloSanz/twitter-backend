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
        id: userId
      }
    })
    return user ? new UserViewDTO(user) : null
  }

  async delete (userId: string): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }

  async getRecommendedUsersPaginated (options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map((user) => new UserViewDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email
          },
          {
            username
          }
        ]
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async publicPosts (userId: string): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        publicPosts: true
      }
    })
  }

  async privatePosts (userId: string): Promise<void> {
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
        id: userId
      }
    })
    return count > 0
  }
}
