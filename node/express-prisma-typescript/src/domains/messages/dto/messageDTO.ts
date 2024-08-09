export class CreateMessageDto {
  senderId: string
  receiverId: string
  content: string

  constructor (senderId: string, receiverId: string, content: string) {
    this.senderId = senderId
    this.receiverId = receiverId
    this.content = content
  }
}

export interface UpdateMessageStatusDto {
  status: MessageStatus
}
export interface JoinRoomPayload {
  receiverId: string
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
