/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Comments management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 4c3e224a-b60a-4b42-bfc6-c6bd7e495ef4
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 606ffcfd-a159-4400-b46d-1cecda23725c
 *         content:
 *           type: string
 *           example: "This is a comment."
 *     ExtendedPostDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "post123"
 *         authorId:
 *           type: string
 *           format: uuid
 *           example: 4c3e224a-b60a-4b42-bfc6-c6bd7e495ef4
 *         content:
 *           type: string
 *           example: "This is a post."
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           example: ["image1.png", "image2.png"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-08-03T12:34:56Z"
 *         author:
 *           $ref: '#/components/schemas/UserDTO'
 *         qtyComments:
 *           type: integer
 *           example: 10
 *         qtyLikes:
 *           type: integer
 *           example: 5
 *         qtyRetweets:
 *           type: integer
 *           example: 3
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 606ffcfd-a159-4400-b46d-1cecda23725c
 *         username:
 *           type: string
 *           example: "john_doe"
 *         email:
 *           type: string
 *           example: "eliseo@gmail.com"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-08-01T12:00:00Z"
 */

/**
 * @swagger
 * /api/comment/by-userId/{userId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments by user ID
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose comments are to be fetched
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of comments made by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommentDto'
 *       401:
 *         description: Unauthorized
*/

/**
 * @swagger
 * /api/comment/:
 *   post:
 *     tags: [Comments]
 *     summary: Add a new comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post to which the comment is added
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *             required:
 *               - postId
 *               - content
 *     responses:
 *       201:
 *         description: The added comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 comment:
 *                   $ref: '#/components/schemas/CommentDto'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/comment/by-postId/{postId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments by post ID
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post whose comments are to be fetched
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: Number of comments to return
 *         schema:
 *           type: integer
 *       - name: before
 *         in: query
 *         description: Get comments before this date
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: after
 *         in: query
 *         description: Get comments after this date
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: A list of comments for the specified post
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
 * /api/comment/comment-count/{postId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get the count of comments for a specific post ID
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: The ID of the post to get comment count for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment count for the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *               example: 15
 *       401:
 *         description: Unauthorized
 */
import { db } from '@utils'
import { Router, Request, Response } from 'express'
import { CommentRepositoryImpl } from '../repository/comment.repository.impl'
import { CommentServiceImpl } from '../service/comment.service.impl'
import HttpStatus from 'http-status'
import 'express-async-errors'
import { CommentDto } from '../dto/comment.dto'
import { UserRepositoryImpl } from '@domains/user/repository'

const commentRouter = Router()
const service = new CommentServiceImpl(new CommentRepositoryImpl(db), new UserRepositoryImpl(db))

commentRouter.get('/by-userId/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params

  const comments = await service.getCommentsByUser(userId)
  return res.status(HttpStatus.OK).json(comments)
})

commentRouter.post('/', async (req: Request, res: Response) => {
  const { postId, content, images } = req.body
  const { userId } = res.locals.context

  const comment: CommentDto = await service.addComment(postId, userId, content, images)
  return res.status(HttpStatus.CREATED).json({ message: 'Comment added successfully', comment })
})

commentRouter.get('/by-postId/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params
  const { limit, before, after } = req.query as Record<string, string>

  const comments = await service.getCommentsByPostId(postId, { limit: Number(limit), before, after })
  return res.status(HttpStatus.OK).json(comments)
})

commentRouter.get('/comment-count/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params
  const count: number = await service.getCommentCount(postId)
  return res.status(HttpStatus.OK).json(count)
})

export { commentRouter }
