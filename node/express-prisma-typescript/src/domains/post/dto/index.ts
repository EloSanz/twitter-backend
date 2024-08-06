import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { UserDTO } from '@domains/user/dto'

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
    content!: string

  @IsOptional()
  @ArrayMaxSize(4, { message: 'images must contain at most 4 items' })
  @IsString({ each: true, message: 'Each image must be a string' })
  @ArrayNotEmpty({ message: 'images array should not be empty' })
    images?: string[]
}

export class PostDTO {
  constructor (post: PostDTO) {
    this.id = post.id
    this.authorId = post.authorId
    this.content = post.content
    this.images = post.images
    this.createdAt = post.createdAt
  }

  id: string
  authorId: string
  content: string
  images: string[]
  createdAt: Date
}

export class ExtendedPostDTO extends PostDTO {
  constructor (post: ExtendedPostDTO) {
    super(post)
    this.author = post.author
    this.qtyComments = post.qtyComments
    this.qtyLikes = post.qtyLikes
    this.qtyRetweets = post.qtyRetweets
  }

  author!: UserDTO
  qtyComments!: number
  qtyLikes!: number
  qtyRetweets!: number
}
function ArrayMaxSize (arg0: number, arg1: { message: string }): (target: CreatePostInputDTO, propertyKey: 'images') => void {
  throw new Error('Function not implemented.')
}

function ArrayNotEmpty (arg0: { message: string }): (target: CreatePostInputDTO, propertyKey: 'images') => void {
  throw new Error('Function not implemented.')
}
