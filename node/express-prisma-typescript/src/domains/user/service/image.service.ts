import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { UserRepository } from '../repository'
import { v4 as uuidv4 } from 'uuid'
import { UserViewDTO } from '../dto'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class ImageService {
  private readonly s3Client: S3Client
  private readonly bucketName: string
  private readonly repository: UserRepository

  constructor (repository: UserRepository) {
    this.s3Client = new S3Client({ region: process.env.AWS_REGION })
    this.bucketName = process.env.AWS_BUCKET_NAME ?? ''
    this.repository = repository
  }

  async uploadImageWithUrlAndKey (userId: string, key: string, uploadUrl: string, buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: buffer,
        headers: { 'Content-Type': mimeType }
      })
      if (!response.ok) {
        throw new Error('Failed to upload image to S3')
      }
      await this.repository.update(userId, key)

      return key
    } catch (error) {
      console.error('Error uploading image:', error)
      throw new Error('Failed to upload image')
    }
  }

  async getUserProfilePictureUrl (userId: string): Promise<string | null> {
    const user: UserViewDTO | null = await this.repository.getById(userId)
    if (!user?.profilePicture) { return null }

    return await this.generateDownloadUrl(user.profilePicture)
  }

  async generateUploadUrl (userId: string): Promise<{ uploadUrl: string, key: string }> {
    const key = `${uuidv4()}`
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key
    })
    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 })

    return { uploadUrl, key }
  }

  async generateDownloadUrl (key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key
      })
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 })
      return url
    } catch (error) {
      console.error('Error generating download URL:', error)
      throw new Error('Failed to generate download URL')
    }
  }
}
