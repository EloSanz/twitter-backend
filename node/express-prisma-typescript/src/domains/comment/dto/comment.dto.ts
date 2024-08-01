export class CommentDto {
  id: string
  userId: string
  content: string

  constructor (id: string, userId: string, content: string) {
    this.id = id
    this.userId = userId
    this.content = content
  }
}
