import { PrismaClient, Message } from '@prisma/client'
import { MessageRepository } from './message.repository'
import { ChatDTO, CreateMessageDto, MessageStatus } from '../dto/messageDTO'
import { Author } from '@domains/user/dto'
import { NotFoundException } from '@utils'

export class MessageRepositoryImpl implements MessageRepository {
  constructor (private readonly db: PrismaClient) {}

  async checkFollowStatus (followerId: string, followedId: string): Promise<boolean> {
    const follows = await this.db.follow.findFirst({
      where: { followerId, followedId }
    })
    return !!follows
  }

  async createMessage (newMessage: CreateMessageDto): Promise<Message> {
    if (!newMessage.senderId || !newMessage.receiverId || !newMessage.content || !newMessage.chatId) {
      throw new Error('Missing required fields')
    }

    const sender = await this.db.user.findUnique({ where: { id: newMessage.senderId } })
    if (!sender) {
      throw new Error(`Sender with ID ${newMessage.senderId} does not exist`)
    }

    const receiver = await this.db.user.findUnique({ where: { id: newMessage.receiverId } })
    if (!receiver) {
      throw new Error(`Receiver with ID ${newMessage.receiverId} does not exist`)
    }

    const chat = await this.db.chat.findUnique({ where: { id: newMessage.chatId } })
    if (!chat) {
      throw new Error(`Chat with ID ${newMessage.chatId} does not exist`)
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

  async getMessagesBetweenUsers (roomId: string): Promise<Message[]> {
    const chat = await this.db.chat.findUnique({
      where: { id: roomId },
      include: { messages: true }
    })
    const messages = chat?.messages ?? []
    return messages
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

  async getAuthor (userId: string): Promise<Author> {
    const user = await this.db.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    return new Author({
      id: user.id,
      name: user.name ?? undefined,
      username: user.username,
      profilePicture: user.profilePicture ?? undefined,
      private: user.private,
      createdAt: user.createdAt
    })
  }

  async getChats (userId: string): Promise<ChatDTO[]> {
    const chats = await this.db.chat.findMany({
      where: {
        users: {
          some: { id: userId }
        }
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true
          }
        }
      }
    })

    const chatDTOs = await Promise.all(chats.map(async (chat) => {
      const usersMapped = await Promise.all(chat.users.map(async (user) => {
        return await this.getAuthor(user.id)
      }))

      const messagesMapped = chat.messages.map((message) => {
        return {
          id: message.id.toString(),
          content: message.content,
          createdAt: message.createdAt,
          chatId: message.chatId,
          senderId: message.senderId,
          sender: new Author({
            id: message.sender.id,
            name: message.sender.name ?? undefined,
            username: message.sender.username,
            profilePicture: message.sender.profilePicture ?? undefined,
            private: message.sender.private,
            createdAt: message.sender.createdAt
          })
        }
      })

      return {
        id: chat.id,
        users: usersMapped,
        messages: messagesMapped
      }
    }))
    return chatDTOs
  }

  async getChatById (chatId: string): Promise<ChatDTO> {
    const chat = await this.db.chat.findUnique({
      where: { id: chatId },
      include: {
        users: true,
        messages: {
          include: {
            sender: true
          }
        }
      }
    })

    if (!chat) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`)
    }

    const usersMapped = await Promise.all(
      chat.users.map(async (user) => {
        return await this.getAuthor(user.id)
      })
    )

    const messagesMapped = chat.messages.map((message) => {
      return {
        id: message.id.toString(),
        content: message.content,
        createdAt: message.createdAt,
        chatId: message.chatId,
        senderId: message.senderId,
        sender: new Author({
          id: message.sender.id,
          name: message.sender.name ?? undefined,
          username: message.sender.username,
          profilePicture: message.sender.profilePicture ?? undefined,
          private: message.sender.private,
          createdAt: message.sender.createdAt
        })
      }
    })

    return {
      id: chat.id,
      users: usersMapped,
      messages: messagesMapped
    }
  }
}
