import { PrismaClient, Message } from '@prisma/client'
import { MessageRepository } from './message.repository'

export class MessageRepositoryImpl implements MessageRepository {
  constructor (private readonly db: PrismaClient) {}
  async createMessage (userId: string, content: string): Promise<Message> {
    return await this.db.message.create({
      data: {
        userId,
        content
      }
    })
  }

  async getMessages (): Promise<Message[]> {
    return await this.db.message.findMany()
  }

  async getMessageById (id: number): Promise<Message | null> {
    return await this.db.message.findUnique({
      where: { id }
    })
  }

  async deleteMessage (id: number): Promise<Message> {
    return await this.db.message.delete({
      where: { id }
    })
  }
}
