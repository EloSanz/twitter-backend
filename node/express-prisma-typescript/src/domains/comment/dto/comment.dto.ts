export class CommentDto {
  id: string
  postId: string
  userId: string
  content: string

  constructor (id: string, postId: string, userId: string, content: string) {
    this.id = id
    this.postId = postId
    this.userId = userId
    this.content = content
  }
}
