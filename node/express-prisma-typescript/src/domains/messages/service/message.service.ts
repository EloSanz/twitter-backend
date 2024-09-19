import { Message } from '@prisma/client'
import { ChatDTO, CreateMessageDto, MessageStatus } from '../dto/messageDTO'

export interface MessageService {
  createRoom: (roomId: string, senderId: any, receiverId: string) => Promise<string>
  checkFollowStatus: (senderId: string, receiverId: string) => Promise<boolean>
  createMessage: (newMessage: CreateMessageDto) => Promise<Message>
  getMessages: () => Promise<Message[]>
  getMessageById: (id: number) => Promise<Message | null>
  deleteMessage: (id: number) => Promise<void>
  softDeleteMessage: (id: number) => Promise<void>
  updateMessageStatus: (id: number, status: MessageStatus) => Promise<Message>
  getMessagesBetweenUsers: (senderId: string, receiverId: string) => Promise<Message[]>
  getChats: (userId: string) => Promise<ChatDTO[]>
}
