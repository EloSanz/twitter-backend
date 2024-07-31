import { Router, Request, Response } from 'express'
import HttpStatus from 'http-status'
import { ReactionService } from '../service/reaction.service'
import { db, isValidReactionType } from '@utils'
import { ReactionRepositoryImpl } from '../repository/reaction.repository.impl'
import { ReactionServiceImpl } from '../service/reaction.service.impl'
import { AddReactionDto, RemoveReactionDto } from '../dto/reactionDto'

export const reactionRouter = Router()

const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

reactionRouter.post('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { type }: AddReactionDto = req.body

  if (!isValidReactionType(type)) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid reaction type' })
  }

  try {
    await service.addReaction(userId, postId, type)
    return res.status(HttpStatus.CREATED).json({ message: 'Reaction added successfully' })
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: `Post already reacted with ${type}` })
  }
})

reactionRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { type }: RemoveReactionDto = req.body

  if (!isValidReactionType(type)) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid reaction type' })
  }

  try {
    await service.removeReaction(userId, postId, type)
    return res.status(HttpStatus.NO_CONTENT).send()
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'An error occurred' })
  }
})
