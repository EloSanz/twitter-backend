/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     UserViewDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the user
 *         name:
 *           type: string
 *           description: Display name of the user (may be null)
 *         username:
 *           type: string
 *           description: Unique username of the user
 *         profilePicture:
 *           type: string
 *           description: URL or key of the user's profile picture (may be null)
 *         publicPosts:
 *           type: boolean
 *           description: Indicates if the user's posts are public
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get user recommendations
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users to retrieve
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of users to skip
 *     responses:
 *       200:
 *         description: List of user recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserViewDTO'
 */
/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current user's details
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserViewDTO'
 */
/**
 * @swagger
 * /api/user/profile-picture:
 *   get:
 *     summary: Get the profile picture URL of the current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Profile picture URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the profile picture
 *       404:
 *         description: Profile picture not found
 */
/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserViewDTO'
 */
/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: Delete the current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User successfully deleted
 */
/**
 * @swagger
 * /api/user/set-public-posts:
 *   put:
 *     summary: Set current user's posts to public
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User posts set to public
 */
/**
 * @swagger
 * /api/user/set-private-posts:
 *   put:
 *     summary: Set current user's posts to private
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User posts set to private
 */
/**
 * @swagger
 * /api/user/download-image/{key}:
 *   get:
 *     summary: Get a signed URL to download an image
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Key of the image to download
 *     responses:
 *       200:
 *         description: Download URL for the image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 downloadUrl:
 *                   type: string
 *                   description: Signed URL to download the image
 */
/**
 * @swagger
 * /api/user/generate-upload-url:
 *   get:
 *     summary: Generate a URL for uploading an image
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: URL for uploading the image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploadUrl:
 *                   type: string
 *                   description: URL to upload the image directly to S3
 */
/**
 * @swagger
 * /api/user/upload-image:
 *   put:
 *     summary: Upload an image for the user
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               uploadUrl:
 *                 type: string
 *                 description: URL to upload the image directly to S3
 *               key:
 *                 type: string
 *                 description: Key of the image to be uploaded
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded
 *     responses:
 *       200:
 *         description: Image successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Image uploaded successfully'
 *                 imageUrl:
 *                   type: string
 *                   description: Key of the uploaded image
 *       400:
 *         description: Bad request, missing upload URL or image
 *       500:
 *         description: Internal server error
 */
import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'
import { ImageService } from '../service/image.service'
import multer from 'multer'
import { FollowerRepositoryImpl } from '@domains/follower/repository/follower.repository.impl'

export const userRouter = Router()
const upload = multer({ storage: multer.memoryStorage() })

const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db),
  new ImageService(new UserRepositoryImpl(db)), new FollowerRepositoryImpl(db))

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
})

userRouter.get('/generate-upload-url', async (req: Request, res: Response) => {
  const userId = res.locals.context.userId
  const uploadUrl = await service.generateUploadUrl(userId) // the client must use this url to upload the image directly to S3

  res.status(HttpStatus.OK).json({ uploadUrl })
})
userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params
  const { userId } = res.locals.context

  const following: boolean = await service.isFollowing(otherUserId, userId)
  const user = await service.getUser(otherUserId)

  return res.status(HttpStatus.OK).json({ user, following })
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

  const downloadUrl = await service.generateDownloadUrl(key)
  res.status(HttpStatus.OK).json({ downloadUrl })
})

userRouter.put('/upload-image', upload.single('image'), async (req: Request, res: Response) => {
  const userId = res.locals.context.userId
  const file = req.file
  const uploadUrl: string = req.body.uploadUrl
  const key: string = req.body.key

  if (!uploadUrl) { return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Upload URL is required' }) }
  if (!file) { return res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' }) }

  const imageUrl = await service.updateUserProfilePicture(userId, key, uploadUrl, file.buffer, file.originalname, file.mimetype)

  res.status(HttpStatus.OK).json({ message: 'Image uploaded successfully', imageUrl })
})
