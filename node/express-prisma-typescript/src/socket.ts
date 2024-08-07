import { Server, Socket } from 'socket.io'
import http from 'http'
import { Constants, verifySocketToken } from '@utils'

export const setupSocketIO = (server: http.Server): Server => {
  const io = new Server(server, {
    cors: { origin: Constants.CORS_WHITELIST }
  })

  io.use((socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.query?.token as string

    if (!token) {
      next(new Error('Authentication error: Token is missing')); return
    }

    verifySocketToken(token, (err, decoded) => {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      if (err || !decoded) {
        console.error('Token verification failed:', err)
        next(new Error('Authentication error')); return
      }
      socket.data.userId = decoded.userId
      next()
    })
  })

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.data.userId)

    socket.on('message', (msg: string) => {
      console.log('Message received:', msg)
      io.emit('message', msg)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.userId)
    })

    socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  })

  return io
}
