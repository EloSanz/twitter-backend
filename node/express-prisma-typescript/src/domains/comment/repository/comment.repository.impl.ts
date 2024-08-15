import { PostType, PrismaClient, ReactionType } from '@prisma/client'
import { CommentDto } from '../dto/comment.dto'
import { CommentRepository } from './comment.repository'
import { ExtendedPostDTO, PostDTO } from '@domains/post/dto'
import { CursorPagination } from '@types'
import { UserDTO } from '@domains/user/dto'

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
    const posts = await this.db.post.findMany({
      where: {
        authorId: userId,
        postType: PostType.POST
      },
      include: {
        comments: true
      }
    })

    const comments = posts.flatMap((post) => post.comments)

    return comments.map((comment) => new CommentDto(comment.id, comment.authorId, comment.content))
  }

  async createComment (postId: string, userId: string, content: string): Promise<CommentDto> {
    const newPost: PostDTO = await this.db.post.create({
      data: {
        authorId: userId,
        content,
        postType: PostType.COMMENT,
        parentId: postId
      }
    })
    const newComment = new CommentDto(newPost.id, userId, newPost.content)

    return newComment
  }

  async getCommentsByPostId (postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const comments = await this.db.post.findMany({
      where: {
        postType: PostType.COMMENT,
        parentId: postId
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
      author: await this.getAuthor(comment.authorId),
      qtyComments: await this.getCommentCount(comment.id),
      qtyLikes: await this.getReactionCount(comment.id, ReactionType.LIKE),
      qtyRetweets: await this.getReactionCount(comment.id, ReactionType.RETWEET)
    })))
  }

  async getAuthor (authorId: string): Promise<UserDTO> {
    const user = await this.db.user.findUnique({
      where: { id: authorId }
    })

    return new UserDTO({
      id: user?.id ?? '',
      name: user?.name ?? null,
      createdAt: user?.createdAt ?? new Date(),
      publicPosts: user?.publicPosts ?? false,
      profileImage: user?.profilePicture
    })
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
