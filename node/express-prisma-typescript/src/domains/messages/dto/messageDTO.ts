export interface CreateMessageDto {
  senderId: string
  receiverId: string
  content: string
}

export interface UpdateMessageStatusDto {
  status: MessageStatus
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

export interface MessageDto {
  id: number
  senderId: string
  receiverId: string
  content: string
  createdAt: Date
  updatedAt: Date
  status: MessageStatus
}
