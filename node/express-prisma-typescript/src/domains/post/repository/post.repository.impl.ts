import { PostType, PrismaClient, ReactionType } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, ExtendedPostDTO, Post, PostDTO } from '../dto'

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

  private async getCommentCount (postId: string): Promise<number> {
    const count = await this.db.post.count({ where: { parentId: postId } })
    return count
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (postId: string): Promise<Post | null> {
    return null
  }

  async getAllByDatePaginated (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        postType: PostType.POST,
        deletedAt: null, // Ensure post is not soft-deleted
        author: {
          deletedAt: null // Ensure author is not soft-deleted
        }
      },
      include: {
        author: true,
        reactions: true
      },
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ]
    })

    const extendedPosts = await Promise.all(posts.map(async post => {
      const qtyComments = await this.getCommentCount(post.id)
      const qtyLikes = post.reactions.filter(reaction => reaction.type === ReactionType.LIKE).length
      const qtyRetweets = post.reactions.filter(reaction => reaction.type === ReactionType.RETWEET).length

      return new ExtendedPostDTO({
        id: post.id,
        authorId: post.authorId,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt,
        author: post.author,
        qtyComments,
        qtyLikes,
        qtyRetweets
      })
    }))

    return extendedPosts
  }

  async getFollowingPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        postType: PostType.POST,
        deletedAt: null,
        author: {
          deletedAt: null,
          followers: { some: { followerId: userId } }
        }
      },
      include: {
        author: true,
        reactions: true
      },
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ]
    })

    const extendedPosts = await Promise.all(posts.map(async post => {
      const qtyComments = await this.getCommentCount(post.id)
      const qtyLikes = post.reactions.filter(reaction => reaction.type === ReactionType.LIKE).length
      const qtyRetweets = post.reactions.filter(reaction => reaction.type === ReactionType.RETWEET).length

      return new ExtendedPostDTO({
        id: post.id,
        authorId: post.authorId,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt,
        author: post.author,
        qtyComments,
        qtyLikes,
        qtyRetweets
      })
    }))

    return extendedPosts
  }

  async getRecommendedPaginated (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        postType: PostType.POST,
        authorId: {
          not: userId
        },
        OR: [
          { author: { private: false } },
          { author: { followers: { some: { followerId: userId } } } }
        ]
      },
      include: {
        author: true,
        reactions: true
      },
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ]
    })

    const extendedPosts = await Promise.all(posts.map(async post => {
      const qtyComments = await this.getCommentCount(post.id)
      const qtyLikes = post.reactions.filter(reaction => reaction.type === ReactionType.LIKE).length
      const qtyRetweets = post.reactions.filter(reaction => reaction.type === ReactionType.RETWEET).length

      return new ExtendedPostDTO({
        id: post.id,
        authorId: post.authorId,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt,
        author: post.author,
        qtyComments,
        qtyLikes,
        qtyRetweets
      })
    }))

    return extendedPosts
  }

  async getByUserId (authorId: string): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId,
        postType: PostType.POST,
        deletedAt: null,
        author: {
          deletedAt: null
        }
      },
      include: {
        author: true,
        reactions: true
      }
    })

    const extendedPosts = await Promise.all(posts.map(async post => {
      const qtyComments = await this.getCommentCount(post.id)
      const qtyLikes = post.reactions.filter(reaction => reaction.type === ReactionType.LIKE).length
      const qtyRetweets = post.reactions.filter(reaction => reaction.type === ReactionType.RETWEET).length

      return new ExtendedPostDTO({
        id: post.id,
        authorId: post.authorId,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt,
        author: post.author,
        qtyComments,
        qtyLikes,
        qtyRetweets
      })
    }))

    return extendedPosts
  }

  async existById (postId: string): Promise<boolean> {
    const count = await this.db.post.count({
      where: {
        id: postId,
        deletedAt: null
      }
    })
    return count > 0
  }
}
