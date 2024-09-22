import { Author } from '@domains/user/dto'

export class CreateMessageDto {
  senderId: string
  receiverId: string
  content: string
  chatId: string
  constructor (senderId: string, receiverId: string, content: string, chatId: string) {
    this.senderId = senderId
    this.receiverId = receiverId
    this.content = content
    this.chatId = chatId
  }
}

export interface UpdateMessageStatusDto {
  status: MessageStatus
}
export interface JoinRoomPayload {
  roomId: string
}
export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

export interface MessageDto {
  id: number
  senderId: string
  roomId: string
  content: string
  createdAt: Date
  updatedAt: Date
  status: MessageStatus
}

export interface MessageResponseDto {
  id: number
  userId: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface MessageDTO {
  id: string
  content: string
  createdAt: Date
  chatId: string
  senderId: string
  sender: Author
}

export interface ChatDTO {
  id: string
  users: Author[]
  messages: MessageDTO[]
}
