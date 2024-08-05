import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'
import multer from 'multer'

import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'
import { ImageService } from '../service/image.service'

export const userRouter = Router()
const upload = multer({ storage: multer.memoryStorage() })

// Use dependency injection

const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db), new ImageService(new UserRepositoryImpl(db)))

userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/pp', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const url: string | null = await service.getUserProfilePictureUrl(userId)
  if (!url) { return res.status(HttpStatus.NOT_FOUND).json({ message: 'Profile picture not found' }) }

  res.status(HttpStatus.OK).json({ url })
  res.status(HttpStatus.OK)
})

userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params
  const user = await service.getUser(otherUserId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

userRouter.put('/publicPosts', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  console.log('*******:', userId)
  await service.publicPosts(userId)

  return res.status(HttpStatus.OK).json({ message: 'User posts set to public' })
})

userRouter.put('/privatePosts', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.privatePosts(userId)

  return res.status(HttpStatus.OK).json({ message: 'User posts set to private' })
})

userRouter.post('/upload-image', upload.single('image'), async (req: Request, res: Response) => {
  const userId = res.locals.context.userId
  const file = req.file
  if (!file) { return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' }) }

  const imageUrl = await service.updateUserProfilePicture(userId, file.buffer, file.originalname, file.mimetype)
  res.status(HttpStatus.OK).json({ message: 'Image uploaded successfully', imageUrl })
})
