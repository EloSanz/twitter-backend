import { CommentDto } from '../dto/comment.dto'
import { CommentRepository } from '../repository/comment.repository'
import { CommentService } from './comment.service'

export class CommentServiceImpl implements CommentService {
  constructor (private readonly repository: CommentRepository) {}

  async getCommentsByUser (userId: string): Promise<CommentDto[]> {
    return await this.repository.findByUser(userId)
  }

  async addComment (postId: string, userId: string, content: string): Promise<void> {
    await this.repository.createComment(postId, userId, content)
  }

  async getCommentsByPost (postId: string): Promise<CommentDto[]> {
    return await this.repository.getCommentsByPostId(postId)
  }
}