import { CommentDto } from '../dto/comment.dto'
import { CommentRepository } from '../repository/comment.repository'
import { CommentService } from './comment.service'
import { NotFoundException } from '@utils/errors'
import { UserRepository } from '@domains/user/repository'
import { CursorPagination } from '@types'
import { ExtendedPostDTO } from '@domains/post/dto'

export class CommentServiceImpl implements CommentService {
  constructor (private readonly repository: CommentRepository, private readonly userRepository: UserRepository) {}

  private async ensurePostExists (postId: string): Promise<void> {
    const postExist: boolean = await this.repository.existById(postId)
    if (!postExist) { throw new NotFoundException('Post does not exist') }
  }

  async getCommentsByUser (userId: string): Promise<CommentDto[]> {
    if (!(await this.userRepository.existById(userId))) { throw new NotFoundException('User') }
    return await this.repository.getCommentsByUserId(userId)
  }

  async addComment (postId: string, userId: string, content: string, images: string[]): Promise<CommentDto> {
    return await this.repository.createComment(postId, userId, content, images)
  }

  async getCommentsByPostId (postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    await this.ensurePostExists(postId)
    return await this.repository.getCommentsByPostId(postId, options)
  }

  async getCommentCount (postId: string): Promise<number> {
    await this.ensurePostExists(postId)

    return await this.repository.getCommentCount(postId)
  }
}
