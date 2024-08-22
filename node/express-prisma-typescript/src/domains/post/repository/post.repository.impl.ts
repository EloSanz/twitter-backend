import { PostType, PrismaClient, ReactionType } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { UserDTO } from '@domains/user/dto'

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

  async getAllByDatePaginated (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        postType: PostType.POST
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ]
    })

    const extendedPosts = await Promise.all(posts.map(async post => {
      const author = await this.getAuthor(post.authorId) // include and verify if is following or has public posts
      const qtyComments = await this.getCommentCount(post.id)
      const qtyLikes = await this.getReactionCount(post.id, ReactionType.LIKE)
      const qtyRetweets = await this.getReactionCount(post.id, ReactionType.RETWEET)

      return new ExtendedPostDTO({
        id: post.id,
        authorId: post.authorId,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt,
        author,
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
        postType: PostType.POST
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ]
    })

    const extendedPosts = await Promise.all(posts.map(async post => {
      const author = await this.getAuthor(post.authorId)

      const isFollowing = await this.isFollowing(userId, post.authorId)
      if (!author.publicPosts && !isFollowing) { return null }

      const qtyComments = await this.getCommentCount(post.id)
      const qtyLikes = await this.getReactionCount(post.id, ReactionType.LIKE)
      const qtyRetweets = await this.getReactionCount(post.id, ReactionType.RETWEET)

      return new ExtendedPostDTO({
        id: post.id,
        authorId: post.authorId,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt,
        author,
        qtyComments,
        qtyLikes,
        qtyRetweets
      })
    }))

    return extendedPosts.filter(post => post !== null)
  }

  private async isFollowing (followerId: string, followedId: string): Promise<boolean> {
    const existingFollower = await this.db.follow.findFirst({
      where: {
        followerId,
        followedId
      }
    })
    return !!existingFollower
  }

  private async getAuthor (authorId: string): Promise<UserDTO> {
    const user = await this.db.user.findUnique({ where: { id: authorId } })
    if (!user) throw new Error('User not found')
    return new UserDTO(user)
  }

  private async getCommentCount (postId: string): Promise<number> {
    const count = await this.db.post.count({ where: { parentId: postId } })
    return count
  }

  private async getReactionCount (postId: string, reactionType: ReactionType): Promise<number> {
    const count = await this.db.reaction.count({
      where: {
        postId,
        type: reactionType
      }
    })
    return count
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

  async getByUserId (authorId: string): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId,
        postType: PostType.POST
      }
    })

    const extendedPosts = await Promise.all(posts.map(async post => {
      const author = await this.getAuthor(post.authorId)
      const qtyComments = await this.getCommentCount(post.id)
      const qtyLikes = await this.getReactionCount(post.id, ReactionType.LIKE)
      const qtyRetweets = await this.getReactionCount(post.id, ReactionType.RETWEET)

      return new ExtendedPostDTO({
        id: post.id,
        authorId: post.authorId,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt,
        author,
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
        id: postId
      }
    })
    return count > 0
  }
}
