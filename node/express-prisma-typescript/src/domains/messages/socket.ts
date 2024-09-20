/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Server, Socket } from 'socket.io'
import http from 'http'
import { Constants, db, UnauthorizedException, verifySocketToken } from '@utils'
import { MessageService } from '@domains/messages/service/message.service'
import { MessageServiceImpl } from '@domains/messages/service/message.service.impl'
import { MessageRepositoryImpl } from '@domains/messages/repository/message.repository.impl'
import { CreateMessageDto, JoinRoomPayload } from '@domains/messages/dto/messageDTO'
import { SendMessagePayload } from '@domains/messages/chatClient'
import { Message } from '@prisma/client'
import { UserRepositoryImpl } from '@domains/user/repository'

const messageService: MessageService = new MessageServiceImpl(new MessageRepositoryImpl(db), new UserRepositoryImpl(db))

export const setupSocketIO = (server: http.Server): Server => {
  const io = new Server(server, {
    cors: { origin: Constants.CORS_WHITELIST }
  })

  const userSockets = new Map<string, Socket>()

  io.use((socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.headers.token as string

    if (!token) {
      next(new UnauthorizedException('Authentication error: Token is missing')); return
    }

    verifySocketToken(token, (err, decoded) => {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      if (err || !decoded) {
        next(new UnauthorizedException('Authentication error')); return
      }

      socket.data.userId = decoded.userId
      userSockets.set(socket.data.userId, socket)

      next()
    })
  })

  io.on('connection', (socket: Socket) => {
    console.log('User connected: ', socket.data.userId)

    socket.on('joinRoom', async ({ receiverId }: JoinRoomPayload) => {
      const senderId = socket.data.userId

      if (!senderId || !receiverId) {
        console.error('Sender ID and Receiver ID are required')
        return
      }

      try {
        const followStatus: boolean = await messageService.checkFollowStatus(senderId, receiverId)
        if (followStatus) {
          socket.emit('error', 'You can only chat if you follow each other.')
          return
        }

        const roomId = getRoomId(senderId, receiverId)
        const chatId: string = await messageService.createRoom(roomId, senderId, receiverId)
        await socket.join(roomId)

        const messages: Message[] = await messageService.getMessagesBetweenUsers(senderId, receiverId)
        socket.emit('previousMessages', messages)

        console.log(`User ${senderId} joined chat with ${receiverId}`)
      } catch (error) {
        console.error('Error joining room or fetching messages:', error)
      }
    })

    socket.on('sendMessage', async ({ receiverId, content }: SendMessagePayload) => {
      const senderId = socket.data.userId
      const chatId = getRoomId(senderId, receiverId)

      const messageData: CreateMessageDto = new CreateMessageDto(senderId, receiverId, content, chatId)

      try {
        const message = await messageService.createMessage(messageData)

        const receiverSocket = userSockets.get(receiverId)
        if (receiverSocket) { receiverSocket.emit('message', { senderId, content }) }

        // console.log('Message saved and sent:', message)
      } catch (error) {
        console.error('Error sending message:', error)
      }
    })

    socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.userId)
      userSockets.delete(socket.data.userId)
    })
  })

  return io
}

function getRoomId (userId1: string, userId2: string): string {
  const [firstId, secondId] = [userId1, userId2].sort()
  return `room-${firstId}-${secondId}`
}
