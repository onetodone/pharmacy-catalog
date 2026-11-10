import { BadRequestException } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { mkdir } from 'fs'
import { extname, join, resolve } from 'path'
import { diskStorage } from 'multer'
import type { Request } from 'express'

const IMAGE_MIME = new Set(['image/png', 'image/jpeg', 'image/webp'])

/** Absolute directory holding uploaded files: `UPLOADS_DIR`, or `uploads/` in the working directory. */
export function uploadsRoot(): string {
  return resolve(process.env.UPLOADS_DIR || 'uploads')
}

/** Multer options for one image stored under `uploadsRoot()/<subdir>`. */
export function imageUpload(subdir: string) {
  return {
    storage: diskStorage({
      // Resolved per request: this factory runs in a decorator, before ConfigModule has loaded `.env`.
      destination: (_req: Request, _file: Express.Multer.File, cb: (e: Error | null, dest: string) => void) => {
        const dest = join(uploadsRoot(), subdir)
        mkdir(dest, { recursive: true }, (err) => cb(err, dest))
      },
      filename: (_req: Request, file: Express.Multer.File, cb: (e: Error | null, name: string) => void) => {
        const ext = extname(file.originalname).toLowerCase() || '.jpg'
        cb(null, `${randomUUID()}${ext}`)
      },
    }),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req: Request, file: Express.Multer.File, cb: (e: Error | null, ok: boolean) => void) => {
      if (!IMAGE_MIME.has(file.mimetype)) {
        return cb(new BadRequestException('Only PNG, JPEG or WEBP images are allowed'), false)
      }
      cb(null, true)
    },
  }
}

export function relativeUploadPath(subdir: string, file: Express.Multer.File) {
  return `${subdir}/${file.filename}`
}
