import { CommentDto } from '../dto/comment.dto'
import { CommentRepository } from '../repository/comment.repository'
import { CommentService } from './comment.service'
import { NotFoundException } from '@utils/errors'
import { UserRepository } from '@domains/user/repository'

export class CommentServiceImpl implements CommentService {
  constructor (private readonly repository: CommentRepository, private readonly userRepository: UserRepository) {}

  async getCommentsByUser (userId: string): Promise<CommentDto[]> {
    if (!(await this.userRepository.existById(userId))) {
      throw new NotFoundException('User')
    }

    return await this.repository.findByUser(userId)
  }

  async addComment (postId: string, userId: string, content: string): Promise<CommentDto> {
    return await this.repository.createComment(postId, userId, content)
  }

  async getCommentsByPost (postId: string): Promise<CommentDto[]> {
    return await this.repository.getCommentsByPostId(postId)
  }
}
