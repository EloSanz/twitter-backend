// utils.test.ts
import { PostRepository } from '@domains/post/repository'
import { UserRepository } from '@domains/user/repository'
import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { ImageService } from '@domains/user/service/image.service'
import { CommentRepository } from '@domains/comment/repository/comment.repository'
import { mock } from 'jest-mock-extended'
import { FollowerRepository } from '@domains/follower/repository/follower.repository'

export const mockCommentRepository = mock<CommentRepository>()
export const mockUserRepository = mock<UserRepository>()
export const mockFollowerRepository = mock<FollowerRepository>()
export const mockImageService = mock<ImageService>()
export const mockReactionRepository = mock<ReactionRepository>()
export const mockPostRepository = mock<PostRepository>()
