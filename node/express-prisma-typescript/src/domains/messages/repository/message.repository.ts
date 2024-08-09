import { Message } from '@prisma/client'
import { CreateMessageDto, MessageStatus } from '../dto/messageDTO'

export interface MessageRepository {
  createMessage: (newMessage: CreateMessageDto) => Promise<Message>
  getMessages: () => Promise<Message[]>
  getMessageById: (id: number) => Promise<Message | null>
  deleteMessage: (id: number) => Promise<Message>
  updateMessageStatus: (id: number, status: MessageStatus) => Promise<Message>
  getMessagesBetweenUsers: (senderId: string, receiverId: string) => Promise<Message[]>

}
