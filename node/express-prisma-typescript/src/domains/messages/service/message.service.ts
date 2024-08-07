import { Message } from '@prisma/client'

export interface MessageService {
  createMessage: (userId: string, content: string) => Promise<Message>
  getMessages: () => Promise<Message[]>
  getMessageById: (id: number) => Promise<Message | null>
  deleteMessage: (id: number) => Promise<Message>
}
