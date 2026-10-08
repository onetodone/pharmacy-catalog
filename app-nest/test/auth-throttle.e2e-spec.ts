import './utils/throttle-env' // must precede any import that loads AppModule
import request from 'supertest'
import { createE2EApp, E2EContext, resetDatabase } from './utils/e2e-app'
import { seedWorld, TEST_PASSWORD } from './utils/fixtures'

function refreshCookie(res: request.Response): string {
  const raw = res.headers['set-cookie'] as unknown as string[] | undefined
  const cookie = raw?.find((c) => c.startsWith('refreshToken='))
  if (!cookie) throw new Error('no refreshToken cookie on response')
  return cookie.split(';')[0]
}

// THROTTLE_LIMIT is forced to 3 and REFRESH_THROTTLE_LIMIT to 6 (see ./utils/throttle-env).
describe('Auth rate limiting (e2e)', () => {
  let ctx: E2EContext

  beforeAll(async () => {
    ctx = await createE2EApp()
    await resetDatabase(ctx.prisma)
    await seedWorld(ctx.prisma)
  })

  afterAll(async () => {
    await ctx.app.close()
  })

  // Each test runs from its own client IP, so the per-IP buckets don't leak between tests.
  const from = (ip: string) => ({ 'X-Forwarded-For': ip })

  it('429s once the per-IP login limit is exceeded', async () => {
    const attempt = () =>
      request(ctx.server)
        .post('/api/auth/login')
        .set(from('10.0.0.1'))
        .send({ login: 'customer1', password: 'wrong-on-purpose' })

    const statuses: number[] = []
    for (let i = 0; i < 5; i++) {
      statuses.push((await attempt()).status)
    }

    expect(statuses.slice(0, 3)).toEqual([401, 401, 401])
    expect(statuses).toContain(429)
  })

  it('gives refresh its own limit, independent of the login limit', async () => {
    const ip = from('10.0.0.2')
    const login = await request(ctx.server)
      .post('/api/auth/login')
      .set(ip)
      .send({ login: 'customer1', password: TEST_PASSWORD })
      .expect(200)
    let cookie = refreshCookie(login)

    const statuses: number[] = []
    for (let i = 0; i < 8; i++) {
      const res = await request(ctx.server).post('/api/auth/refresh').set(ip).set('Cookie', cookie)
      statuses.push(res.status)
      if (res.status === 200) cookie = refreshCookie(res)
    }

    expect(statuses.slice(0, 6)).toEqual([200, 200, 200, 200, 200, 200])
    expect(statuses.slice(6)).toEqual([429, 429])

    await request(ctx.server)
      .post('/api/auth/login')
      .set(ip)
      .send({ login: 'customer1', password: TEST_PASSWORD })
      .expect(200)
  })
})
