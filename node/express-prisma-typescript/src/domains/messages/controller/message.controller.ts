import { Request, Response, Router } from 'express'
import { MessageRepositoryImpl } from '../repository/message.repository.impl'
import { db } from '@utils'
import { MessageServiceImpl } from '../service/message.service.impl'
import HttpStatus from 'http-status'
import { Message } from '@prisma/client'

const service = new MessageServiceImpl(new MessageRepositoryImpl(db))

export const messageRouter = Router()

messageRouter.get('/', async (req: Request, res: Response) => {
  const messages = await service.getMessages()

  res.status(HttpStatus.OK).json(messages)
})

messageRouter.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  const message: Message | null = await service.getMessageById(id)

  res.status(HttpStatus.OK).json(message)
})

messageRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  await service.deleteMessage(id)
  res.status(HttpStatus.OK).json({ message: 'Message deleted successfully' })
})
