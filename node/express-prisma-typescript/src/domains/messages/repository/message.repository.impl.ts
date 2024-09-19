import { PrismaClient, Message } from '@prisma/client'
import { MessageRepository } from './message.repository'
import { ChatDTO, CreateMessageDto, MessageStatus } from '../dto/messageDTO'

export class MessageRepositoryImpl implements MessageRepository {
  constructor (private readonly db: PrismaClient) {}

  async checkFollowStatus (followerId: string, followedId: string): Promise<boolean> {
    const follows = await this.db.follow.findFirst({
      where: { followerId, followedId }
    })
    return !!follows
  }

  async createMessage (newMessage: CreateMessageDto): Promise<Message> {
    if (!newMessage.senderId || !newMessage.receiverId || !newMessage.content) {
      throw new Error('Missing required fields')
    }
    const message = await this.db.message.create({
      data: {
        sender: { connect: { id: newMessage.senderId } },
        receiver: { connect: { id: newMessage.receiverId } },
        content: newMessage.content,
        chat: { connect: { id: newMessage.chatId } }
      }
    })
    return message
  }

  async getMessagesBetweenUsers (senderId: string, receiverId: string): Promise<Message[]> {
    return await this.db.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ],
        deletedAt: null
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
  }

  async getMessages (): Promise<Message[]> {
    return await this.db.message.findMany({
      where: { deletedAt: null }
    })
  }

  async getMessageById (id: number): Promise<Message | null> {
    return await this.db.message.findUnique({
      where: { id, deletedAt: null }
    })
  }

  async deleteMessage (id: number): Promise<void> {
    await this.db.message.delete({
      where: { id }
    })
  }

  async softDeleteMessage (messageId: number): Promise<void> {
    await this.db.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() }
    })
  }

  async updateMessageStatus (id: number, status: MessageStatus): Promise<Message> {
    return await this.db.message.update({
      where: { id },
      data: { status }
    })
  }

  private async roomExist (roomId: string): Promise<boolean> {
    const room = await this.db.chat.findFirst({ where: { id: roomId } })
    return room !== null
  }

  async createRoom (roomId: string, userId: string, receiverId: string): Promise<string> {
    if (await this.roomExist(roomId)) {
      console.log('exists')
      return roomId
    }

    // Encontrar los usuarios a partir de sus IDs
    const users = await this.db.user.findMany({
      where: { id: { in: [userId, receiverId] } }
    })

    if (users.length !== 2) {
      throw new Error('One or both users not found')
    }

    // Crear el chat y vincular los usuarios
    await this.db.chat.create({
      data: {
        id: roomId,
        users: {
          connect: users.map((user) => ({ id: user.id })) // Conectar usuarios por ID
        },
        messages: {
          create: [] // Crear el chat vacío, sin mensajes iniciales
        }
      }
    })

    return roomId
  }

  async getChats (userId: string): Promise<ChatDTO[]> {
    //
    return []
  }
}
