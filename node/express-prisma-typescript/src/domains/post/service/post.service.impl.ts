import { CreatePostInputDTO, PostDTO } from '../dto'
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

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPostByPostId (userId: string, postId: string): Promise<PostDTO> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('Post not found')

    const author: UserViewDTO | null = await this.userRepository.getById(post.authorId)
    if (!author) throw new NotFoundException('Author not found')

    const isFollowing = await this.followRepository.isFollowing(userId, author.id)

    if (author.publicPosts || isFollowing) {
      return new PostDTO(post)
    } else {
      throw new NotFoundException('Post not found')
    }
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    const followedUserIds = await this.followRepository.getFollowedUserIds(userId)
    const publicPostAuthors = await this.userRepository.getPublicPostAuthors()
    const posts = await this.repository.getAllByDatePaginated(options)

    const filteredPosts = posts.filter(post =>
      post.authorId === userId || // posts by the user themselves
      publicPostAuthors.includes(post.authorId) || // posts by authors with public posts
      followedUserIds.includes(post.authorId) // posts by followed users
    )

    return filteredPosts.map(post => new PostDTO(post))
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    const author: UserViewDTO | null = await this.userRepository.getById(authorId)
    if (!author) throw new NotFoundException('Author not found')

    const posts: PostDTO[] = await this.repository.getByAuthorId(authorId)

    const isFollowing: boolean = await this.followRepository.isFollowing(userId, author.id)

    if (!author.publicPosts && !isFollowing) {
      throw new NotFoundException('The profile is private')
    } else {
      return posts
    }
  }
}
