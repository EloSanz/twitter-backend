import { PostType, PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        content: data.content,
        images: data.images,
        postType: PostType.POST // added type
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map(post => new PostDTO(post))
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      }
    })
    return (post != null) ? new PostDTO(post) : null
  }

  async getByAuthorId (authorId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId
      }
    })
    return posts.map(post => new PostDTO(post))
  }

  async existById (postId: string): Promise<boolean> {
    const count = await this.db.post.count({
      where: {
        id: postId
      }
    })
    return count > 0
  }
}
