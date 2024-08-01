import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'

import { FollowerServiceImpl } from '../service/follower.service.impl'
import { FollowerRepositoryImpl } from '../repository/follower.repository.impl'
import { db } from '@utils/database'
import { UserRepositoryImpl } from '@domains/user/repository'

export const followerRouter = Router()
const service = new FollowerServiceImpl(new FollowerRepositoryImpl(db), new UserRepositoryImpl(db))

followerRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
  const followerId = res.locals.context.userId
  const followedId = req.params.user_id
  await service.follow(followerId, followedId)
  res.status(HttpStatus.OK).json({ message: 'Successfully followed user' })
})

followerRouter.post('/unfollow/:user_id', async (req: Request, res: Response) => {
  const followerId = res.locals.context.userId
  const followedId = req.params.user_id
  await service.unfollow(followerId, followedId)
  res.status(HttpStatus.OK).json({ message: 'Successfully unfollowed user' })
})

followerRouter.get('/followed', async (req: Request, res: Response) => {
  const userId = res.locals.context.userId
  const followedUserIds = await service.getUserFollowed(userId)
  res.status(HttpStatus.OK).json(followedUserIds)
})

followerRouter.get('/followers', async (req: Request, res: Response) => {
  const userId = res.locals.context.userId
  const followers = await service.getUserFollowers(userId)
  res.status(HttpStatus.OK).json(followers)
})
