import { CommentServiceImpl } from '@domains/comment/service'
import { mockCommentRepository, mockUserRepository } from '@test/utils'
import { NotFoundException } from '@utils/errors'

describe('CommentServiceImpl', () => {
  let commentService: CommentServiceImpl
  beforeEach(() => {
    commentService = new CommentServiceImpl(
      mockCommentRepository,
      mockUserRepository
    )
  })
  describe('getCommentsByUser', () => {
    it('should throw NotFoundException when the user does not exist', async () => {
      const userId = 'nonExistingUserId';

      (mockUserRepository.existById as jest.Mock).mockResolvedValue(false)

      await expect(commentService.getCommentsByUser(userId))
        .rejects
        .toThrow(NotFoundException)
    })
    it('should throw NotFoundException when the post does not exist', async () => {
      const postId = 'nonExistingPostId'
      const options = { };
      (mockCommentRepository.existById as jest.Mock).mockResolvedValue(false)

      await expect(commentService.getCommentsByPostId(postId, options))
        .rejects
        .toThrow(NotFoundException)
    })
  })
})
