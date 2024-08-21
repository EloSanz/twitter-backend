/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInputDTO'
 *           examples:
 *             example1:
 *               summary: Example request for signup
 *               value:
 *                 email: "eliseo@gmail.com"
 *                 username: "elito"
 *                 password: "StrongPassword123@"
 *     responses:
 *       201:
 *         description: Successfully registered user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInputDTO'
 *           examples:
 *             example1:
 *               summary: Example request for login
 *               value:
 *                 email: "elito@gmail.com"
 *                 password: "StrongPassword123@"
 *     responses:
 *       200:
 *         description: Successfully authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: Not found. Couldn't find user
 *       500:
 *         description: Internal server error
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     SignupInputDTO:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address for the new user
 *         username:
 *           type: string
 *           description: The username for the new user
 *         password:
 *           type: string
 *           description: The password for the new user (must be strong)
 *     LoginInputDTO:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address for authentication
 *         username:
 *           type: string
 *           description: The username for authentication
 *         password:
 *           type: string
 *           description: The password for authentication
 */

import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'
import { UserRepositoryImpl } from '@domains/user/repository'

import { AuthService, AuthServiceImpl } from '../service'
import { LoginInputDTO, SignupInputDTO } from '../dto'

export const authRouter = Router()

// Use dependency injection
const service: AuthService = new AuthServiceImpl(new UserRepositoryImpl(db))

authRouter.post('/signup', BodyValidation(SignupInputDTO), async (req: Request, res: Response) => {
  const data = req.body

  const token = await service.signup(data)

  return res.status(HttpStatus.CREATED).json(token)
})

authRouter.post('/login', BodyValidation(LoginInputDTO), async (req: Request, res: Response) => {
  const data = req.body

  const token = await service.login(data)

  return res.status(HttpStatus.OK).json(token)
})
