import { PostDTO, CreatePostInputDTO, ExtendedPostDTO } from '@domains/post/dto'
import { PostServiceImpl } from '@domains/post/service'
import { UserViewDTO, UserDTO } from '@domains/user/dto'
import { mockPostRepository, mockFollowerRepository, mockUserRepository } from '@test/utils'
import { NotFoundException } from '@utils'

describe('PostServiceImpl', () => {
  let postService: PostServiceImpl

  beforeEach(() => {
    postService = new PostServiceImpl(
      mockPostRepository,
      mockFollowerRepository,
      mockUserRepository
    )
  })
  describe('addPost', () => {
    it('should add a post succesfully with valid data', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const content = 'test content'

      const mockPostDto: PostDTO = { id: postId, authorId: userId, content, images: [], createdAt: new Date() }
      mockPostRepository.create.mockResolvedValue(mockPostDto)

      const mockCreatePostInputDTO: CreatePostInputDTO = { content }
      const result = await postService.createPost(userId, mockCreatePostInputDTO)

      expect(result.content).toBe(content)
      expect(mockPostRepository.create).toHaveBeenCalledWith(userId, mockCreatePostInputDTO)
    })
  })
  describe('getPostsByUserId', () => {
    it('should return posts when the author exists and posts are public', async () => {
      const userId = 'userId'
      const authorId = 'authorId'
      const authorViewDTO: UserViewDTO = {
        id: authorId,
        name: 'Author Name',
        username: 'username',
        profilePicture: 'profilePic.jpg',
        private: true
      }
      const authorDTO: UserDTO = {
        id: authorId,
        name: 'Author Name',
        createdAt: new Date(),
        profileImage: 'profilePic.jpg',
        private: true
      }
      const posts: ExtendedPostDTO[] = [{
        id: 'postId',
        authorId,
        content: 'content',
        images: ['image1.jpg'],
        createdAt: new Date(),
        author: authorDTO,
        qtyComments: 10,
        qtyLikes: 5,
        qtyRetweets: 2
      }]

      mockUserRepository.getById.mockResolvedValue(authorViewDTO)
      mockPostRepository.getByUserId.mockResolvedValue(posts)

      const result = await postService.getPostsByUserId(userId, authorId)

      expect(result).toEqual(posts)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(authorId)
      expect(mockPostRepository.getByUserId).toHaveBeenCalledWith(authorId)
    })

    it('should return posts when the author exists and the user is following', async () => {
      const userId = 'userId'
      const authorId = 'authorId'
      const author: UserDTO = {
        id: authorId,
        name: 'Author Name',
        createdAt: new Date(),
        private: true,
        profileImage: 'profilePic.jpg'
      }
      const authorViewDTO: UserViewDTO = {
        id: authorId,
        name: 'Author Name',
        username: 'username',
        profilePicture: 'profilePic.jpg',
        private: true
      }
      const posts: ExtendedPostDTO[] = [{
        id: 'postId',
        authorId,
        content: 'content',
        images: ['image1.jpg'],
        createdAt: new Date(),
        author,
        qtyComments: 10,
        qtyLikes: 5,
        qtyRetweets: 2
      }]

      mockUserRepository.getById.mockResolvedValue(authorViewDTO)
      mockPostRepository.getByUserId.mockResolvedValue(posts)
      mockFollowerRepository.isFollowing.mockResolvedValue(true)

      const result = await postService.getPostsByUserId(userId, authorId)

      expect(result).toEqual(posts)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(authorId)
      expect(mockPostRepository.getByUserId).toHaveBeenCalledWith(authorId)
      expect(mockFollowerRepository.isFollowing).toHaveBeenCalledWith(userId, authorId)
    })

    it('should throw NotFoundException when the author is not found', async () => {
      const userId = 'userId'
      const authorId = 'authorId'

      mockUserRepository.getById.mockResolvedValue(null)

      await expect(postService.getPostsByUserId(userId, authorId)).rejects.toThrow(NotFoundException)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(authorId)
    })

    it('should throw NotFoundException when the author is private and the user is not following', async () => {
      const userId = 'userId'
      const authorId = 'authorId'
      const authorViewDTO = { id: authorId, name: 'Author Name', username: 'username', profilePicture: 'profilePic.jpg', private: false } satisfies UserViewDTO
      mockUserRepository.getById.mockResolvedValue(authorViewDTO)
      mockFollowerRepository.isFollowing.mockResolvedValue(false)

      await expect(postService.getPostsByUserId(userId, authorId)).rejects.toThrow(NotFoundException)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(authorId)
      expect(mockFollowerRepository.isFollowing).toHaveBeenCalledWith(userId, authorId)
    })
  })
  describe('getPostByPostId', () => {
    it('should return the post when the post and author exist and author has public posts', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const post = { id: postId, authorId: 'authorId', content: 'content', images: [], createdAt: new Date() } satisfies PostDTO
      const author: UserViewDTO = { id: 'authorId', name: 'Author Name', username: 'authorUsername', profilePicture: 'profilePic.jpg', private: true }

      mockPostRepository.getById.mockResolvedValue(post)
      mockUserRepository.getById.mockResolvedValue(author)
      mockFollowerRepository.isFollowing.mockResolvedValue(false) // Not relevant since author has public posts

      const result = await postService.getPostByPostId(userId, postId)

      expect(result).toEqual(new PostDTO(post))
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(post.authorId)
    })

    it('should return the post when the post and author exist and the user is following', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const post = { id: postId, authorId: 'authorId', content: 'content', images: [], createdAt: new Date() } satisfies PostDTO
      const author: UserViewDTO = { id: 'authorId', name: 'Author Name', username: 'authorUsername', profilePicture: 'profilePic.jpg', private: false }

      mockPostRepository.getById.mockResolvedValue(post)
      mockUserRepository.getById.mockResolvedValue(author)
      mockFollowerRepository.isFollowing.mockResolvedValue(true)

      const result = await postService.getPostByPostId(userId, postId)

      expect(result).toEqual(new PostDTO(post))
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(post.authorId)
      expect(mockFollowerRepository.isFollowing).toHaveBeenCalledWith(userId, author.id)
    })

    it('should throw NotFoundException when the post does not exist', async () => {
      const userId = 'userId'
      const postId = 'postId'

      mockPostRepository.getById.mockResolvedValue(null)

      await expect(postService.getPostByPostId(userId, postId)).rejects.toThrow(NotFoundException)
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId)
    })

    it('should throw NotFoundException when the author does not exist', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const post = { id: postId, authorId: 'authorId', content: 'content', images: [], createdAt: new Date() } satisfies PostDTO

      mockPostRepository.getById.mockResolvedValue(post)
      mockUserRepository.getById.mockResolvedValue(null)

      await expect(postService.getPostByPostId(userId, postId)).rejects.toThrow(NotFoundException)
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(post.authorId)
    })

    it('should throw NotFoundException when the author is private and the user is not following', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const post = { id: postId, authorId: 'authorId', content: 'content', images: [], createdAt: new Date() } satisfies PostDTO
      const author: UserViewDTO = { id: 'authorId', name: 'Author Name', username: 'authorUsername', profilePicture: 'profilePic.jpg', private: false }

      mockPostRepository.getById.mockResolvedValue(post)
      mockUserRepository.getById.mockResolvedValue(author)
      mockFollowerRepository.isFollowing.mockResolvedValue(false)

      await expect(postService.getPostByPostId(userId, postId)).rejects.toThrow(NotFoundException)
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(post.authorId)
      expect(mockFollowerRepository.isFollowing).toHaveBeenCalledWith(userId, author.id)
    })
  })
})
