import { Message } from '@prisma/client'
import { MessageRepositoryImpl } from '../repository/message.repository.impl'
import { MessageService } from './message.service'

export class MessageServiceImpl implements MessageService {
  constructor (private readonly messageRepo: MessageRepositoryImpl) {}

  async createMessage (userId: string, content: string): Promise<Message> {
    return await this.messageRepo.createMessage(userId, content)
  }

  async getMessages (): Promise<Message[]> {
    return await this.messageRepo.getMessages()
  }

  async getMessageById (id: number): Promise<Message | null> {
    return await this.messageRepo.getMessageById(id)
  }

  async deleteMessage (id: number): Promise<Message> {
    return await this.messageRepo.deleteMessage(id)
  }
}
