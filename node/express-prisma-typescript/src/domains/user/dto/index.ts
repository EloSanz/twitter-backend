import { Post } from '@domains/post/dto'
import { User } from '@prisma/client'

export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
    this.private = user.private
    this.profileImage = user.profileImage
  }

  id: string
  name: string | null
  createdAt: Date
  private: boolean
  profileImage?: string | null
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.name = user.name
    this.password = user.password
  }

  email!: string
  username!: string
  password!: string
}
export class UserViewDTO {
  constructor (user: User) {
    this.id = user.id
    this.name = user.name ?? undefined
    this.username = user.username
    this.profilePicture = user.profilePicture ?? undefined
    this.private = user.private
    this.createdAt = user.createdAt
  }

  id: string
  name?: string
  username: string
  profilePicture?: string
  private: boolean
  createdAt?: Date
}

/// ////////////////////////////////////////////
export class Author {
  id: string
  name?: string
  username: string
  profilePicture?: string
  private: boolean
  createdAt: Date

  constructor (id: string, username_: string, private_: boolean, createdAt: Date, profilePicture?: string, name?: string) {
    this.id = id
    this.name = name
    this.username = username_
    this.profilePicture = profilePicture
    this.private = private_
    this.createdAt = createdAt
  }
}

export class UserProfile {
  constructor (user: UserProfile) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
    this.private = user.private
    this.createdAt = user.createdAt
    this.followers = user.followers
    this.following = user.following
    this.posts = user.posts
  }

  id: string
  name?: string
  username: string
  profilePicture?: string
  private: boolean
  createdAt: Date
  followers: Author[]
  following: Author[]
  posts: Post[]
}
