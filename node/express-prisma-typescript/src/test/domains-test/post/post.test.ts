import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '@domains/post/dto'
import { PostServiceImpl } from '@domains/post/service'
import { UserDTO, UserViewDTO } from '@domains/user/dto'
import { NotFoundException } from '@utils'
import { mockPostRepository, mockFollowerRepository, mockUserRepository } from '@test/utils'

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

      const mockPostDto: PostDTO = { id: postId, authorId: userId, content, images: [], createdAt: new Date() };
      (mockPostRepository.create as jest.Mock).mockResolvedValue(mockPostDto)

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
      const author: UserDTO = {
        id: authorId,
        name: 'Author Name',
        createdAt: new Date(),
        publicPosts: true,
        profileImage: 'profilePic.jpg'
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
      }];

      (mockUserRepository.getById as jest.Mock).mockResolvedValue(author);
      (mockPostRepository.getByUserId as jest.Mock).mockResolvedValue(posts)

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
        publicPosts: true,
        profileImage: 'profilePic.jpg'
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
      }];

      (mockUserRepository.getById as jest.Mock).mockResolvedValue(author);
      (mockPostRepository.getByUserId as jest.Mock).mockResolvedValue(posts);
      (mockFollowerRepository.isFollowing as jest.Mock).mockResolvedValue(true)

      const result = await postService.getPostsByUserId(userId, authorId)

      expect(result).toEqual(posts)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(authorId)
      expect(mockPostRepository.getByUserId).toHaveBeenCalledWith(authorId)
      expect(mockFollowerRepository.isFollowing).toHaveBeenCalledWith(userId, authorId)
    })

    it('should throw NotFoundException when the author is not found', async () => {
      const userId = 'userId'
      const authorId = 'authorId';

      (mockUserRepository.getById as jest.Mock).mockResolvedValue(null)

      await expect(postService.getPostsByUserId(userId, authorId)).rejects.toThrow(NotFoundException)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(authorId)
    })

    it('should throw NotFoundException when the author is private and the user is not following', async () => {
      const userId = 'userId'
      const authorId = 'authorId'
      const author: UserDTO = {
        id: authorId,
        name: 'Author Name',
        createdAt: new Date(),
        publicPosts: false,
        profileImage: 'profilePic.jpg'
      };

      (mockUserRepository.getById as jest.Mock).mockResolvedValue(author);
      (mockFollowerRepository.isFollowing as jest.Mock).mockResolvedValue(false)

      await expect(postService.getPostsByUserId(userId, authorId)).rejects.toThrow(NotFoundException)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(authorId)
      expect(mockFollowerRepository.isFollowing).toHaveBeenCalledWith(userId, authorId)
    })
  })
  describe('getPostByPostId', () => {
    it('should return the post when the post and author exist and author has public posts', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const post = { id: postId, authorId: 'authorId', content: 'content', images: [], createdAt: new Date() } as unknown as PostDTO
      const author: UserViewDTO = { id: 'authorId', name: 'Author Name', username: 'authorUsername', profilePicture: 'profilePic.jpg', publicPosts: true };

      (mockPostRepository.getById as jest.Mock).mockResolvedValue(post);
      (mockUserRepository.getById as jest.Mock).mockResolvedValue(author);
      (mockFollowerRepository.isFollowing as jest.Mock).mockResolvedValue(false) // Not relevant since author has public posts

      const result = await postService.getPostByPostId(userId, postId)

      expect(result).toEqual(new PostDTO(post))
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(post.authorId)
    })

    it('should return the post when the post and author exist and the user is following', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const post = { id: postId, authorId: 'authorId', content: 'content', images: [], createdAt: new Date() } as unknown as PostDTO
      const author: UserViewDTO = { id: 'authorId', name: 'Author Name', username: 'authorUsername', profilePicture: 'profilePic.jpg', publicPosts: false };

      (mockPostRepository.getById as jest.Mock).mockResolvedValue(post);
      (mockUserRepository.getById as jest.Mock).mockResolvedValue(author);
      (mockFollowerRepository.isFollowing as jest.Mock).mockResolvedValue(true)

      const result = await postService.getPostByPostId(userId, postId)

      expect(result).toEqual(new PostDTO(post))
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(post.authorId)
      expect(mockFollowerRepository.isFollowing).toHaveBeenCalledWith(userId, author.id)
    })

    it('should throw NotFoundException when the post does not exist', async () => {
      const userId = 'userId'
      const postId = 'postId';

      (mockPostRepository.getById as jest.Mock).mockResolvedValue(null)

      await expect(postService.getPostByPostId(userId, postId)).rejects.toThrow(NotFoundException)
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId)
    })

    it('should throw NotFoundException when the author does not exist', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const post = { id: postId, authorId: 'authorId', content: 'content', images: [], createdAt: new Date() } as unknown as PostDTO

      (mockPostRepository.getById as jest.Mock).mockResolvedValue(post);
      (mockUserRepository.getById as jest.Mock).mockResolvedValue(null)

      await expect(postService.getPostByPostId(userId, postId)).rejects.toThrow(NotFoundException)
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(post.authorId)
    })

    it('should throw NotFoundException when the author is private and the user is not following', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const post = { id: postId, authorId: 'authorId', content: 'content', images: [], createdAt: new Date() } as unknown as PostDTO
      const author: UserViewDTO = { id: 'authorId', name: 'Author Name', username: 'authorUsername', profilePicture: 'profilePic.jpg', publicPosts: false };

      (mockPostRepository.getById as jest.Mock).mockResolvedValue(post);
      (mockUserRepository.getById as jest.Mock).mockResolvedValue(author);
      (mockFollowerRepository.isFollowing as jest.Mock).mockResolvedValue(false)

      await expect(postService.getPostByPostId(userId, postId)).rejects.toThrow(NotFoundException)
      expect(mockPostRepository.getById).toHaveBeenCalledWith(postId)
      expect(mockUserRepository.getById).toHaveBeenCalledWith(post.authorId)
      expect(mockFollowerRepository.isFollowing).toHaveBeenCalledWith(userId, author.id)
    })
  })
})
