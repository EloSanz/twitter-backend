import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { UserRepository } from '../repository'
import { v4 as uuidv4 } from 'uuid'
import { UserViewDTO } from '../dto'

export class ImageService {
  private readonly s3Client: S3Client
  private readonly bucketName: string
  private readonly repository: UserRepository

  constructor (repository: UserRepository) {
    this.s3Client = new S3Client({ region: process.env.AWS_REGION })
    this.bucketName = process.env.AWS_BUCKET_NAME ?? ''
    this.repository = repository
  }

  async uploadImage (userId: string, buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    const key = `${uuidv4()}-${originalName}`
    console.log(this.bucketName)
    try {
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType
      }))

      const imageUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}`

      await this.repository.update(userId, imageUrl)

      return imageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw new Error('Failed to upload image')
    }
  }

  async getUserProfilePictureUrl (userId: string): Promise<string | null> {
    const user: UserViewDTO | null = await this.repository.getById(userId)
    if (!user?.profilePicture) { return null }
    console.log(user)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${user.profilePicture}`
    return url
  }
}
