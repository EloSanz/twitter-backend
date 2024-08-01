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
  const { postId, content } = req.body
  const { userId } = res.locals.context

  const comment: CommentDto = await service.addComment(postId, userId, content)
  return res.status(HttpStatus.CREATED).json({ message: 'Comment added successfully', comment })
})

commentRouter.get('/by-postId/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params

  const comments = await service.getCommentsByPost(postId)
  return res.status(HttpStatus.OK).json(comments)
})

export { commentRouter }
