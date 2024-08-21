import { UserRepository } from '@domains/user/repository'
import {
  checkPassword,
  ConflictException,
  encryptPassword,
  generateAccessToken,
  NotFoundException,
  UnauthorizedException
} from '@utils'

import { LoginInputDTO, SignupInputDTO, TokenDTO } from '../dto'
import { AuthService } from './auth.service'
import { Prisma } from '@prisma/client'

export class AuthServiceImpl implements AuthService {
  constructor (private readonly repository: UserRepository) {}

  async signup (data: SignupInputDTO): Promise<TokenDTO> {
    const existingUser = await this.repository.getByEmailOrUsernameRegister(data.email, data.username)
    if (existingUser) throw new ConflictException('USER_ALREADY_EXISTS')

    const encryptedPassword = await encryptPassword(data.password)

    try {
      const user = await this.repository.create({ ...data, password: encryptedPassword })
      const token = generateAccessToken({ userId: user.id })

      return { token }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('USER_ALREADY_EXISTS')
        }
      }
      throw error
    }
  }

  async login (data: LoginInputDTO): Promise<TokenDTO> {
    const user = await this.repository.getByEmailOrUsername(data.email, data.username)
    if (!user) throw new NotFoundException('user')

    const isCorrectPassword = await checkPassword(data.password, user.password)

    if (!isCorrectPassword) throw new UnauthorizedException('INCORRECT_PASSWORD')

    const token = generateAccessToken({ userId: user.id })

    return { token }
  }
}
