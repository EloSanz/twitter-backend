/**
 * @swagger
 * tags:
 *   name: Reactions
 *   description: Reaction Management
 */

/**
 * @swagger
 * /api/reaction/{postId}:
 *   post:
 *     tags:
 *       - Reactions
 *     summary: Add a reaction to a post
 *     description: Allows a user to add a reaction to a post
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of the post to react to
 *         required: true
 *         schema:
 *           type: string
 *       - name: reaction
 *         in: body
 *         description: Reaction details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum:
 *                 - LIKE
 *                 - RETWEET
 *     responses:
 *       201:
 *         description: Reaction added successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Reaction added successfully
 *             reaction:
 *               $ref: '#/definitions/ReactionDto'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *   delete:
 *     tags:
 *       - Reactions
 *     summary: Remove a reaction from a post
 *     description: Allows a user to remove a reaction from a post
 *     parameters:
 *       - name: postId
 *         in: path
 *         description: ID of the post to remove the reaction from
 *         required: true
 *         schema:
 *           type: string
 *       - name: reaction
 *         in: body
 *         description: Reaction details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum:
 *                 - LIKE
 *                 - RETWEET
 *     responses:
 *       204:
 *         description: Reaction deleted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post or reaction not found
 */

/**
 * @swagger
 * /api/reaction/likes/{userId}:
 *   get:
 *     tags:
 *       - Reactions
 *     summary: Get all likes by a user
 *     description: Retrieve all likes made by a specific user
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to get likes for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of likes
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/ReactionDto'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/reaction/retweets/{userId}:
 *   get:
 *     tags:
 *       - Reactions
 *     summary: Get all retweets by a user
 *     description: Retrieve all retweets made by a specific user
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to get retweets for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of retweets
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/ReactionDto'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * definitions:
 *   ReactionDto:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         example: e74a7b80-1657-4c38-b7e1-8a6b7d7b7c28
 *       postId:
 *         type: string
 *         example: a5d6f3b8-65d6-4c1d-bbc3-587c41878e0e
 *       userId:
 *         type: string
 *         example: b5e2a4c5-34e9-4e79-9d3e-31b4fd783c98
 *       type:
 *         type: string
 *         enum:
 *           - LIKE
 *           - RETWEET
 */

import { Router, Request, Response } from 'express'
import HttpStatus from 'http-status'
import { ReactionService } from '../service/reaction.service'
import { db } from '@utils'
import { ReactionRepositoryImpl } from '../repository/reaction.repository.impl'
import { ReactionServiceImpl } from '../service/reaction.service.impl'
import { AddReactionDto, ReactionDto, RemoveReactionDto } from '../dto/reactionDto'
import { PostRepositoryImpl } from '@domains/post/repository'
import { UserRepositoryImpl } from '@domains/user/repository'

export const reactionRouter = Router()

const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db), new PostRepositoryImpl(db), new UserRepositoryImpl(db))

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

  await service.removeReaction(userId, postId, type)
  return res.status(HttpStatus.NO_CONTENT).json({ message: `Reaction ${type} deleted successfully` })
})
reactionRouter.get('/likes/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params

  const likes = await service.getLikesByUser(userId)
  return res.status(HttpStatus.OK).json(likes)
})

reactionRouter.get('/retweets/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params

  const retweets = await service.getRetweetsByUser(userId)
  return res.status(HttpStatus.OK).json(retweets)
})
