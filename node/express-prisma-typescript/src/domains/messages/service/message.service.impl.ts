import { Message } from '@prisma/client'
import { MessageRepositoryImpl } from '../repository/message.repository.impl'
import { MessageService } from './message.service'
import { CreateMessageDto, MessageStatus } from '../dto/messageDTO'

export class MessageServiceImpl implements MessageService {
  constructor (private readonly messageRepo: MessageRepositoryImpl) {}

  async createMessage (newMessage: CreateMessageDto): Promise<Message> {
    return await this.messageRepo.createMessage(newMessage)
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

  async updateMessageStatus (id: number, status: MessageStatus): Promise<Message> {
    return await this.messageRepo.updateMessageStatus(id, status)
  }

  async getMessagesBetweenUsers (senderId: string, receiverId: string): Promise<Message[]> {
    return await this.messageRepo.getMessagesBetweenUsers(senderId, receiverId)
  }

  async checkFollowStatus (senderId: string, receiverId: string): Promise<boolean> {
    return await this.messageRepo.checkFollowStatus(senderId, receiverId)
  }
}
