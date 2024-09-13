import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { FollowerRepository } from '@domains/follower/repository/follower.repository'
import { UserRepository } from '@domains/user/repository'
import { UserViewDTO } from '@domains/user/dto'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository, private readonly followRepository: FollowerRepository, private readonly userRepository: UserRepository) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async delete (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPostByPostId (userId: string, postId: string): Promise<PostDTO> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('Post')

    const author: UserViewDTO | null = await this.userRepository.getById(post.authorId)
    if (!author) throw new NotFoundException('Author')
    if (userId === post.authorId) { return new PostDTO(post) }

    const isFollowing = await this.followRepository.isFollowing(userId, author.id)

    if (author.private || isFollowing) { return new PostDTO(post) }
    throw new NotFoundException('Post')
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    return await this.repository.getAllByDatePaginated(userId, options)
  }

  async getRecommendedPaginated (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    return await this.repository.getRecommendedPaginated(userId, options)
  }

  async getPostsByUserId (userId: string, authorId: string): Promise<ExtendedPostDTO[]> {
    const author: UserViewDTO | null = await this.userRepository.getById(authorId)
    if (!author) throw new NotFoundException('Author')

    if (userId === authorId) { return await this.repository.getByUserId(authorId) }
    const isFollowing: boolean = await this.followRepository.isFollowing(userId, author.id)

    if (author.private || isFollowing) { return await this.repository.getByUserId(authorId) }

    throw new NotFoundException('The profile is private')
  }
}
