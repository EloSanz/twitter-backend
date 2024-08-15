// utils.test.ts
import { PostRepository } from '@domains/post/repository'
import { FollowerRepositoryImpl } from '@domains/follower/repository/follower.repository.impl'
import { UserRepository } from '@domains/user/repository'
import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { ImageService } from '@domains/user/service/image.service'
import { CommentRepository } from '@domains/comment/repository/comment.repository'
export const mockPostRepository: PostRepository = {
  create: jest.fn(),
  getAllByDatePaginated: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  getByUserId: jest.fn(),
  existById: jest.fn()
} as unknown as PostRepository

export const mockFollowerRepository: FollowerRepositoryImpl = {
  isFollowing: jest.fn()
} as unknown as FollowerRepositoryImpl

export const mockUserRepository: UserRepository = {
  getById: jest.fn(),
  getRecommendedUsersPaginated: jest.fn(),
  getByUsername: jest.fn(),
  delete: jest.fn(),
  setPublicPosts: jest.fn(),
  setPrivatePosts: jest.fn(),
  existById: jest.fn()
} as unknown as UserRepository

export const mockReactionRepository: ReactionRepository = {
  addReaction: jest.fn(),
  removeeReaction: jest.fn(),
  getRetweetsByUser: jest.fn(),
  getLikesByUser: jest.fn()
} as unknown as ReactionRepository

export const mockImageService: ImageService = {
  getUserProfilePictureUrl: jest.fn(),
  generateUploadUrl: jest.fn(),
  generateDownloadUrl: jest.fn(),
  uploadImageWithUrlAndKey: jest.fn()
} as unknown as ImageService

export const mockCommentRepository: CommentRepository = {
  getCommentsByUserId: jest.fn(),
  createComment: jest.fn(),
  getCommentsByPostId: jest.fn(),
  getCommentCount: jest.fn(),
  existById: jest.fn()
} as unknown as CommentRepository
