import { CreatePostInputDTO, ExtendedPostDTO, Post, PostDTO } from '../dto'

export interface PostService {
  createPost: (userId: string, body: CreatePostInputDTO) => Promise<PostDTO>
  delete: (userId: string, postId: string) => Promise<void>
  getById: (userId: string, postId: string) => Promise<Post | null>
  getLatestPosts: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<ExtendedPostDTO[]>
  getFollowingPosts: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<ExtendedPostDTO[]>
  getRecommendedPaginated: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<ExtendedPostDTO[]>
  getPostsByUserId: (userId: any, authorId: string) => Promise<ExtendedPostDTO[]>
}
