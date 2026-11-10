import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { configureApp } from './setup-app'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  configureApp(app)

  const port = Number(process.env.PORT ?? 3000)
  const host = process.env.HOST
  await (host ? app.listen(port, host) : app.listen(port))

  new Logger('Bootstrap').log(`API ready on http://${host ?? 'localhost'}:${port}/api`)
}

void bootstrap()
