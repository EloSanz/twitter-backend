import { Message } from '@prisma/client'
import { MessageRepositoryImpl } from '../repository/message.repository.impl'
import { MessageService } from './message.service'
import { ChatDTO, CreateMessageDto, MessageStatus } from '../dto/messageDTO'
import { UserRepositoryImpl } from '@domains/user/repository'

export class MessageServiceImpl implements MessageService {
  constructor (private readonly messageRepo: MessageRepositoryImpl, private readonly userRepo: UserRepositoryImpl) {}

  async createMessage (newMessage: CreateMessageDto): Promise<Message> {
    return await this.messageRepo.createMessage(newMessage)
  }

  async getMessages (): Promise<Message[]> {
    return await this.messageRepo.getMessages()
  }

  async getMessageById (id: number): Promise<Message | null> {
    return await this.messageRepo.getMessageById(id)
  }

  async softDeleteMessage (id: number): Promise<void> {
    await this.messageRepo.softDeleteMessage(id)
  }

  async deleteMessage (id: number): Promise<void> {
    await this.messageRepo.deleteMessage(id)
  }

  async updateMessageStatus (id: number, status: MessageStatus): Promise<Message> {
    return await this.messageRepo.updateMessageStatus(id, status)
  }

  async getMessagesBetweenUsers (senderId: string, receiverId: string): Promise<Message[]> {
    return await this.messageRepo.getMessagesBetweenUsers(senderId, receiverId)
  }

  async checkFollowStatus (senderId: string, receiverId: string): Promise<boolean> {
    return await this.messageRepo.checkFollowStatus(senderId, receiverId)
  }

  async createRoom (roomId: string, senderId: string, receiverId: string): Promise<string> {
    return await this.messageRepo.createRoom(roomId, senderId, receiverId)
  }

  async getChats (userId: string): Promise<ChatDTO[]> {
    return await this.messageRepo.getChats(userId)
  }
}
