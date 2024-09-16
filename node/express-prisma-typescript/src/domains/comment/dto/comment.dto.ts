export class CommentDto {
  id: string
  userId: string
  content: string
  images: string[]
  constructor (id: string, userId: string, content: string, images: string[]) {
    this.id = id
    this.userId = userId
    this.content = content
    this.images = images
  }
}
