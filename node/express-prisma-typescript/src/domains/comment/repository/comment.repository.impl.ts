import { PostType, PrismaClient } from '@prisma/client'
import { CommentDto } from '../dto/comment.dto'
import { CommentRepository } from './comment.repository'
import { PostDTO } from '@domains/post/dto'

export class CommentRepositoryImpl implements CommentRepository {
  constructor (private readonly db: PrismaClient) {}

  async findByUser (userId: string): Promise<CommentDto[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId: userId,
        postType: PostType.POST
      },
      include: {
        comments: true // Incluye los comentarios relacionados
      }
    })

    // Mapea todos los comentarios encontrados
    const comments = posts.flatMap(post =>
      post.comments.map(comment => ({
        id: comment.id,
        postId: comment.parentId ?? post.id, // Usa parentId si está presente, sino el ID del post
        userId: comment.authorId,
        content: comment.content
      }))
    )

    return comments
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
    const newComment = new CommentDto(
      newPost.id,
      postId,
      userId,
      newPost.content
    )

    return newComment
  }

  async getCommentsByPostId (postId: string): Promise<CommentDto[]> {
    const comments = await this.db.post.findMany({
      where: {
        postType: PostType.COMMENT,
        parentId: postId
      }
    })

    return comments.map(comment => ({
      id: comment.id,
      postId: comment.parentId ?? postId,
      userId: comment.authorId,
      content: comment.content
    }))
  }
}
