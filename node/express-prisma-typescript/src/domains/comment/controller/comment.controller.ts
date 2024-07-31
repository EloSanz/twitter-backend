import { db } from '@utils'
import { Router, Request, Response } from 'express'
import { CommentRepositoryImpl } from '../repository/comment.repository.impl'
import { CommentServiceImpl } from '../service/comment.service.impl'
import HttpStatus from 'http-status'

const commentRouter = Router()
const service = new CommentServiceImpl(new CommentRepositoryImpl(db))

commentRouter.get('/by-userId/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    const comments = await service.getCommentsByUser(userId)
    return res.status(HttpStatus.OK).json(comments)
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error })
  }
})

commentRouter.post('/', async (req: Request, res: Response) => {
  const { postId, content } = req.body
  const { userId } = res.locals.context

  try {
    await service.addComment(postId, userId, content)
    return res.status(HttpStatus.CREATED).json({ message: 'Comment added successfully' })
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error })
  }
})

commentRouter.get('/by-post/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params

  try {
    const comments = await service.getCommentsByPost(postId)
    return res.status(HttpStatus.OK).json(comments)
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error })
  }
})

export { commentRouter }
