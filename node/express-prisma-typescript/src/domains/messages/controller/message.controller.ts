import { Request, Response, Router } from 'express'
import { MessageRepositoryImpl } from '../repository/message.repository.impl'
import { db } from '@utils'
import { MessageServiceImpl } from '../service/message.service.impl'
import HttpStatus from 'http-status'

const service = new MessageServiceImpl(new MessageRepositoryImpl(db))

export const messageRouter = Router()
messageRouter.post('/', async (req: Request, res: Response) => {
  const { userId, content } = req.body

  const message = await service.createMessage(userId, content)
  res.status(HttpStatus.CREATED).json(message)
})
messageRouter.get('/', async (req: Request, res: Response) => {
  const messages = await service.getMessages()
  res.status(HttpStatus.OK).json(messages)
})

messageRouter.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  const message = await service.getMessageById(id)
  if (message) {
    res.status(HttpStatus.OK).json(message)
  } else {
    res.status(HttpStatus.NOT_FOUND).json({ error: 'Message' })
  }
})

messageRouter.delete('/', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  const message = await service.deleteMessage(id)
  res.status(200).json(message)
})
