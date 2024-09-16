import { PostType, PrismaClient, ReactionType } from '@prisma/client'
import { CommentDto } from '../dto/comment.dto'
import { CommentRepository } from './comment.repository'
import { ExtendedPostDTO, PostDTO } from '@domains/post/dto'
import { CursorPagination } from '@types'

export class CommentRepositoryImpl implements CommentRepository {
  constructor (private readonly db: PrismaClient) {}
  async existById (postId: string): Promise <boolean> {
    const count = await this.db.post.count({
      where: {
        id: postId
      }
    })
    return count > 0
  }

  async getCommentsByUserId (userId: string): Promise<CommentDto[]> {
    const comments = await this.db.post.findMany({
      where: {
        authorId: userId,
        postType: PostType.COMMENT,
        author: { deletedAt: null }
      },
      include: { author: true }
    })

    return comments.map((comment) => new CommentDto(comment.id, comment.authorId, comment.content, comment.images))
  }

  async createComment (postId: string, userId: string, content: string, images: string[]): Promise<CommentDto> {
    const newPost: PostDTO = await this.db.post.create({
      data: {
        authorId: userId,
        content,
        images,
        postType: PostType.COMMENT,
        parentId: postId
      }
    })
    const newComment = new CommentDto(newPost.id, userId, newPost.content, newPost.images)

    return newComment
  }

  async getCommentsByPostId (postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const comments = await this.db.post.findMany({
      where: {
        postType: PostType.COMMENT,
        parentId: postId
      },
      include: {
        reactions: true,
        author: true
      },
      cursor: options.after ? { id: options.after } : undefined,
      skip: options.after ? 1 : undefined,
      take: options.limit ? options.limit : undefined,
      orderBy: [
        { reactions: { _count: 'desc' } },
        { createdAt: 'desc' }
      ]
    })

    return await Promise.all(comments.map(async comment => new ExtendedPostDTO({
      id: comment.id,
      authorId: comment.authorId,
      content: comment.content,
      images: comment.images,
      createdAt: comment.createdAt,
      author: comment.author,
      qtyComments: await this.getCommentCount(comment.id),
      qtyLikes: comment.reactions.filter(reaction => reaction.type === ReactionType.LIKE).length,
      qtyRetweets: comment.reactions.filter(reaction => reaction.type === ReactionType.RETWEET).length
    })))
  }

  async getCommentCount (postId: string): Promise<number> {
    return await this.db.post.count({
      where: {
        parentId: postId,
        postType: PostType.COMMENT
      }
    })
  }

  async getReactionCount (postId: string, reactionType: ReactionType): Promise<number> {
    return await this.db.reaction.count({
      where: {
        postId,
        type: reactionType
      }
    })
  }
}
