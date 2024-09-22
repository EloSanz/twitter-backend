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

    socket.on('joinRoom', async ({ roomId }: JoinRoomPayload) => {
      console.log('User joined room ', roomId)

      await socket.join(roomId)
      try {
        const messages = await messageService.getMessagesBetweenUsers(roomId)
        socket.emit('previousMessages', messages)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    })

    socket.on('sendMessage', async ({ receiverId, content }: SendMessagePayload) => {
      const senderId = socket.data.userId
      const chatId = getRoomId(senderId, receiverId)

      try {
        const messageData: CreateMessageDto = {
          senderId,
          receiverId,
          content,
          chatId
        }

        const message = await messageService.createMessage(messageData)

        // Envía el mensaje solo a los participantes de la sala
        io.to(chatId).emit('message', message)
        console.log(message)
      } catch (error) {
        console.error('Error sending message:', error)
      }
    })

    socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.userId)
    })
  })

  return io
}

function getRoomId (userId1: string, userId2: string): string {
  const [firstId, secondId] = [userId1, userId2].sort()
  return `room-${firstId}-${secondId}`
}
