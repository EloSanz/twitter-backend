import { ArrayMaxSize, ArrayNotEmpty, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { Author, UserDTO } from '@domains/user/dto'
import { Reaction } from '@domains/reaction/dto/reactionDto'

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

/// /////////////////////////////////////////////
export class Post {
  constructor (
    id: string,
    content: string,
    createdAt: Date,
    authorId: string,
    author: Author,
    reactions: Reaction[] = [],
    comments: Post[] = [],
    parentId?: string,
    images?: string[]
  ) {
    this.id = id
    this.content = content
    this.createdAt = createdAt
    this.authorId = authorId
    this.author = author
    this.reactions = reactions ?? []
    this.comments = comments ?? []
    this.parentId = parentId
    this.images = images
  }

  id: string
  content: string
  parentId?: string
  images?: string[]
  createdAt: Date
  authorId: string
  author: Author
  reactions: Reaction[]
  comments: Post[]
}
