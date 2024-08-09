import { PrismaClient, Message } from '@prisma/client'
import { MessageRepository } from './message.repository'
import { CreateMessageDto, MessageStatus } from '../dto/messageDTO'

export class MessageRepositoryImpl implements MessageRepository {
  constructor (private readonly db: PrismaClient) {}

  async createMessage (newMessage: CreateMessageDto): Promise<Message> {
    if (!newMessage.senderId || !newMessage.receiverId || !newMessage.content) {
      throw new Error('Missing required fields')
    }

    const message = await this.db.message.create({
      data: {
        sender: { connect: { id: newMessage.senderId } },
        receiver: { connect: { id: newMessage.receiverId } },
        content: newMessage.content
      }
    })
    return message
  }

  async getMessagesBetweenUsers (senderId: string, receiverId: string): Promise<Message[]> {
    return await this.db.message.findMany({
      where: {
        OR: [
          {
            senderId,
            receiverId
          },
          {
            senderId: receiverId,
            receiverId: senderId
          }
        ]
      },
      orderBy: {
        createdAt: 'asc'
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

  async updateMessageStatus (id: number, status: MessageStatus): Promise<Message> {
    return await this.db.message.update({
      where: { id },
      data: { status }
    })
  }
}
