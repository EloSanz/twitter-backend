import { PostType, PrismaClient } from '@prisma/client'
import { CommentDto } from '../dto/comment.dto'
import { CommentRepository } from './comment.repository'
import { PostDTO } from '@domains/post/dto'

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

  async getCommentsByPostId (postId: string): Promise<CommentDto[]> {
    const comments = await this.db.post.findMany({
      where: {
        postType: PostType.COMMENT,
        parentId: postId
      }
    })

    return comments.map((comment) => ({
      id: comment.id,
      postId: comment.parentId ?? postId,
      userId: comment.authorId,
      content: comment.content
    }))
  }
}
