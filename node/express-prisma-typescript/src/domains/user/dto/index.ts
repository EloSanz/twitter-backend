export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
    this.publicPosts = user.publicPosts
    this.profileImage = user.profileImage
  }

  id: string
  name: string | null
  createdAt: Date
  publicPosts: boolean
  profileImage?: string
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
  constructor (user: UserViewDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
    this.publicPosts = user.publicPosts
  }

  id: string
  name: string | null
  username: string
  profilePicture: string | null
  publicPosts: boolean
}
