import { ReactionDto } from '@domains/reaction/dto/reactionDto'
import { ReactionServiceImpl } from '@domains/reaction/service'
import { ReactionType } from '@prisma/client'
import { mockReactionRepository, mockPostRepository, mockUserRepository } from '@test/utils'
import { ConflictException, NotFoundException } from '@utils'

describe('ReactionServiceImpl', () => {
  let reactionService: ReactionServiceImpl

  beforeEach(() => {
    reactionService = new ReactionServiceImpl(
      mockReactionRepository,
      mockPostRepository,
      mockUserRepository
    )
  })

  describe('addReaction', () => {
    it('should add a reaction successfully with valid data', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const type: ReactionType = ReactionType.LIKE
      const mockReactionDto: ReactionDto = { id: 'reactionId', postId, userId, type }

      mockPostRepository.existById.mockResolvedValue(true)
      mockReactionRepository.addReaction.mockResolvedValue(mockReactionDto)

      const result = await reactionService.addReaction(userId, postId, type)

      expect(result).toEqual(mockReactionDto)
      expect(mockPostRepository.existById).toHaveBeenCalledWith(postId)
      expect(mockReactionRepository.addReaction).toHaveBeenCalledWith(postId, userId, type)
    })

    it('should throw ConflictException if the reaction type is invalid', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const invalidType: ReactionType = 'INVALID' as any

      await expect(reactionService.addReaction(userId, postId, invalidType))
        .rejects
        .toThrow(ConflictException)
      await expect(reactionService.addReaction(userId, postId, invalidType))
        .rejects
        .toHaveProperty('message', 'Conflict')
    })

    it('should throw NotFoundException if the post does not exist', async () => {
      const userId = 'userId'
      const postId = 'postId'
      const type: ReactionType = ReactionType.LIKE

      mockPostRepository.existById.mockResolvedValue(false) // test repo

      await expect(reactionService.addReaction(userId, postId, type))
        .rejects
        .toThrow(NotFoundException)
    })
  })
})
