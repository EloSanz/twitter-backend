import { Router, Request, Response } from 'express'
import HttpStatus from 'http-status'
import { ReactionService } from '../service/reaction.service'
import { db, isValidReactionType } from '@utils'
import { ReactionRepositoryImpl } from '../repository/reaction.repository.impl'
import { ReactionServiceImpl } from '../service/reaction.service.impl'
import { AddReactionDto, ReactionDto, RemoveReactionDto } from '../dto/reactionDto'

export const reactionRouter = Router()

const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

reactionRouter.post('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { type }: AddReactionDto = req.body

  const reaction: ReactionDto = await service.addReaction(userId, postId, type)
  return res.status(HttpStatus.CREATED).json({ message: 'Reaction added successfully', reaction })
})

reactionRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { type }: RemoveReactionDto = req.body
  console.log('deleteando: ', type)
  console.log('del user', userId)

  if (!isValidReactionType(type)) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Invalid reaction type' })
  }

  try {
    await service.removeReaction(userId, postId, type)
    return res.status(HttpStatus.NO_CONTENT).json({ message: `Reaction ${type} deleted successfully` })
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'An error occurred' })
  }
})
reactionRouter.get('/likes/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    const likes = await service.getLikesByUser(userId)
    return res.status(HttpStatus.OK).json(likes)
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error })
  }
})

reactionRouter.get('/retweets/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    const retweets = await service.getRetweetsByUser(userId)
    return res.status(HttpStatus.OK).json(retweets)
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error })
  }
})
