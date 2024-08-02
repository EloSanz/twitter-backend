import { PostType, PrismaClient, ReactionType } from '@prisma/client'
import { CommentDto } from '../dto/comment.dto'
import { CommentRepository } from './comment.repository'
import { ExtendedPostDTO, PostDTO } from '@domains/post/dto'
import { CursorPagination } from '@types'
import { UserDTO } from '@domains/user/dto'

export class CommentRepositoryImpl implements CommentRepository {
  constructor (private readonly db: PrismaClient) {}

  async findByUser (userId: string): Promise<CommentDto[]> {
    // Primero obtenemos todos los posts del usuario
    const posts = await this.db.post.findMany({
      where: {
        authorId: userId,
        postType: PostType.POST // Ajusta el tipo de post si es necesario
      },
      include: {
        comments: true // Incluye los comentarios asociados con los posts
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
      take: options.limit ?? 10,
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

  private async getAuthor (authorId: string): Promise<UserDTO> {
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

  private async getCommentCount (postId: string): Promise<number> {
    return await this.db.post.count({
      where: {
        parentId: postId,
        postType: PostType.COMMENT
      }
    })
  }

  private async getReactionCount (postId: string, reactionType: ReactionType): Promise<number> {
    return await this.db.reaction.count({
      where: {
        postId,
        type: reactionType
      }
    })
  }
}
