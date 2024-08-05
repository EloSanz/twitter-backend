import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'
import { ImageService } from '../service/image.service'
import multer from 'multer'

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

userRouter.get('/profile-picture', async (req: Request, res: Response) => {
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

userRouter.put('/set-public-posts', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  await service.setPublicPosts(userId)

  return res.status(HttpStatus.OK).json({ message: 'User posts set to public' })
})

userRouter.put('/set-private-posts', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  await service.setPrivatePosts(userId)

  return res.status(HttpStatus.OK).json({ message: 'User posts set to private' })
})

userRouter.get('/download-image/:key', async (req: Request, res: Response) => {
  const { key } = req.params

  try {
    const downloadUrl = await service.generateDownloadUrl(key)
    res.status(HttpStatus.OK).json({ downloadUrl })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to generate download URL' })
  }
})

userRouter.post('/generate-upload-url', async (req: Request, res: Response) => {
  const userId = res.locals.context.userId
  // the client must use this url to upload the image directly to S3
  const uploadUrl = await service.generateUploadUrl(userId)

  res.status(HttpStatus.OK).json({ uploadUrl })
})

userRouter.post('/upload-image', upload.single('image'), async (req: Request, res: Response) => {
  const userId = res.locals.context.userId
  const file = req.file
  const uploadUrl: string = req.body.uploadUrl
  const key: string = req.body.key

  if (!uploadUrl) { return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Upload URL is required' }) }
  if (!file) { return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' }) }

  const imageUrl = await service.updateUserProfilePicture(userId, key, uploadUrl, file.buffer, file.originalname, file.mimetype)

  res.status(HttpStatus.OK).json({ message: 'Image uploaded successfully', imageUrl })
})
