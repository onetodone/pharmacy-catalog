import { join, resolve } from 'path'
import { uploadsRoot } from './upload'

describe('uploadsRoot', () => {
  const original = process.env.UPLOADS_DIR

  afterEach(() => {
    if (original === undefined) delete process.env.UPLOADS_DIR
    else process.env.UPLOADS_DIR = original
  })

  it('defaults to uploads/ in the working directory', () => {
    delete process.env.UPLOADS_DIR
    expect(uploadsRoot()).toBe(join(process.cwd(), 'uploads'))
  })

  it('treats an empty value as unset', () => {
    process.env.UPLOADS_DIR = ''
    expect(uploadsRoot()).toBe(join(process.cwd(), 'uploads'))
  })

  it('uses UPLOADS_DIR as an absolute path', () => {
    process.env.UPLOADS_DIR = 'data/files'
    expect(uploadsRoot()).toBe(resolve('data/files'))
  })
})
