/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts management
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePostInputDTO:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the post
 *           example: "This is a new post"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: List of image URLs
 *           example: ["image1.png", "image2.png"]
 *       required:
 *         - content
 *     PostDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the post
 *           example: "1234-5678-9101"
 *         authorId:
 *           type: string
 *           description: The ID of the author
 *           example: "abcd-efgh-ijkl"
 *         content:
 *           type: string
 *           description: The content of the post
 *           example: "This is a post"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: List of image URLs
 *           example: ["image1.png"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the post was created
 *           example: "2023-08-03T00:00:00.000Z"
 *     ExtendedPostDTO:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/PostDTO'
 *         - type: object
 *           properties:
 *             author:
 *               $ref: '#/components/schemas/UserDTO'
 *             qtyComments:
 *               type: integer
 *               description: Number of comments on the post
 *               example: 5
 *             qtyLikes:
 *               type: integer
 *               description: Number of likes on the post
 *               example: 10
 *             qtyRetweets:
 *               type: integer
 *               description: Number of retweets of the post
 *               example: 3
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user
 *           example: "abcd-efgh-ijkl"
 *         username:
 *           type: string
 *           description: The username of the user
 *           example: "johndoe"
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: "eliseo@gmail.com"
 */
/**
 * @swagger
 * /api/post:
 *   get:
 *     tags: [Posts]
 *     summary: Get the latest posts
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           example: ""
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *           example: ""
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPostDTO'
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/post/{postId}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get posts by post ID
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: The maximum number of posts to return
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: before
 *         description: Cursor for fetching posts before a specific post ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         description: Cursor for fetching posts after a specific post ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPostDTO'
 *       401:
 *         description: Unauthorized - User authentication required
 */

/**
 * @swagger
 * /api/post/recommended:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get recommended posts
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: The maximum number of recommended posts to return
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: before
 *         description: Cursor for fetching recommended posts before a specific post ID
 *         schema:
 *           type: string
 *           example: "previous_post_id"
 *       - in: query
 *         name: after
 *         description: Cursor for fetching recommended posts after a specific post ID
 *         schema:
 *           type: string
 *           example: "next_post_id"
 *     responses:
 *       200:
 *         description: A list of recommended posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPostDTO'
 *       401:
 *         description: Unauthorized - User authentication required
 */

/**
 * @swagger
 * /api/post/by_user/{userId}:
 *   get:
 *     tags: [Posts]
 *     summary: Get posts by a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of posts by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPostDTO'
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/post:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInputDTO'
 *     responses:
 *       201:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExtendedPostDTO'
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/post/{postId}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post by its ID
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 */
import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'

import { PostRepositoryImpl } from '../repository'
import { PostService, PostServiceImpl } from '../service'
import { CreatePostInputDTO } from '../dto'
import { FollowerRepositoryImpl } from '@domains/follower/repository/follower.repository.impl'
import { UserRepositoryImpl } from '@domains/user/repository'

export const postRouter = Router()

// Use dependency injection
const service: PostService = new PostServiceImpl(new PostRepositoryImpl(db), new FollowerRepositoryImpl(db), new UserRepositoryImpl(db))

postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>

  const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})
postRouter.get('/recommended', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, before, after } = req.query as Record<string, string>

  const posts = await service.getRecommendedPaginated(userId, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(posts)
})
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  const post = await service.getPostByPostId(userId, postId)
  return res.status(HttpStatus.OK).json(post)
})

postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: authorId } = req.params

  const posts = await service.getPostsByUserId(userId, authorId)

  return res.status(HttpStatus.OK).json(posts)
})

postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const post = await service.createPost(userId, data)

  return res.status(HttpStatus.CREATED).json(post)
})

postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await service.delete(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
})
