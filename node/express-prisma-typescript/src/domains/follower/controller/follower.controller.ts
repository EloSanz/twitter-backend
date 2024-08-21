/**
 * @swagger
 * tags:
 *   name: Follower
 *   description: Manage follow and unfollow
 */

/**
 * @swagger
 * /api/follower/follow/{user_id}:
 *   post:
 *     summary: Follow a user
 *     tags: [Follower]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to follow
 *     responses:
 *       200:
 *         description: Successfully followed user
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/follower/unfollow/{user_id}:
 *   post:
 *     summary: Unfollow a user
 *     tags: [Follower]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to unfollow
 *     responses:
 *       200:
 *         description: Successfully unfollowed user
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/follower/followed:
 *   get:
 *     summary: Get a list of users followed by the current user
 *     tags: [Follower]
 *     responses:
 *       200:
 *         description: A list of followed user IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/follower/followers:
 *   get:
 *     summary: Get a list of followers of the current user
 *     tags: [Follower]
 *     responses:
 *       200:
 *         description: A list of followers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the follower
 *                   name:
 *                     type: string
 *                     description: The name of the follower
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

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
