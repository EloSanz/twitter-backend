import { Constants } from '@utils/constants'
import io from 'socket.io-client'
import { CreateMessageDto } from './dto/messageDTO'
import { Message } from '@prisma/client'

const socket = io(`http://localhost:${Constants.PORT}`, {})

export interface SendMessagePayload {
  receiverId: string
  content: string
}

function sendMessage ({ receiverId, content }: SendMessagePayload): void {
  socket.emit('sendMessage', { receiverId, content })
}
function joinRoom (receiverId: string): void {
  socket.emit('joinRoom', { receiverId })
}

socket.on('message', (messageData: CreateMessageDto) => {
  console.log('New message received:', messageData)
})

socket.on('previousMessager', (messages: Message[]) => {
  console.log(messages)
})

socket.on('error', (error) => {
  console.error('WebSocket error:', error)
})

socket.on('welcome', (welcomeData: { userId: string, message: string }) => {
  const { userId, message } = welcomeData
  console.log(`Welcome message from server: ${message} (User ID: ${userId})`)
})

export { joinRoom, sendMessage }
