import { existsSync, mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import request from 'supertest'
import { bearerFor, createE2EApp, E2EContext, resetDatabase } from './utils/e2e-app'
import { seedWorld, SeededWorld } from './utils/fixtures'

describe('Uploads (e2e)', () => {
  const uploadsDir = mkdtempSync(join(tmpdir(), 'pharmacy-uploads-'))
  const original = process.env.UPLOADS_DIR
  const image = Buffer.from('89504e470d0a1a0a', 'hex')

  let ctx: E2EContext
  let world: SeededWorld

  beforeAll(async () => {
    process.env.UPLOADS_DIR = uploadsDir
    ctx = await createE2EApp()
    await resetDatabase(ctx.prisma)
    world = await seedWorld(ctx.prisma)
  })

  afterAll(async () => {
    await ctx.app.close()
    if (original === undefined) delete process.env.UPLOADS_DIR
    else process.env.UPLOADS_DIR = original
    rmSync(uploadsDir, { recursive: true, force: true })
  })

  it('stores a product cover in UPLOADS_DIR and serves it at /uploads', async () => {
    const asSupplier = await bearerFor(ctx, 'supplier1')

    const res = await request(ctx.server)
      .post(`/api/products/${world.productA.id}/cover`)
      .set('Authorization', asSupplier)
      .attach('file', image, { filename: 'cover.png', contentType: 'image/png' })
      .expect(201)

    expect(res.body.cover).toMatch(/^products\/.+\.png$/)
    expect(existsSync(join(uploadsDir, res.body.cover))).toBe(true)

    const served = await request(ctx.server).get(`/uploads/${res.body.cover}`).expect(200)
    expect(served.headers['content-type']).toContain('image/png')
  })
})
