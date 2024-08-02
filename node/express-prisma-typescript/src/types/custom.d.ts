import { Multer } from 'multer'

interface File extends Multer.File {}

declare global {
  namespace Express {
    interface Request {
      file?: File
    }
  }
}
