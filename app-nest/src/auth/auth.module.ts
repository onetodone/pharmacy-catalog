import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { getAccessTokenTtl, resolveJwtSecret } from './jwt-config'
import { AUTH_THROTTLER, REFRESH_THROTTLER } from './throttlers'

@Module({
  imports: [
    PassportModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const ttl = Number(config.get('THROTTLE_TTL') ?? 60_000)
        return [
          { name: AUTH_THROTTLER, ttl, limit: Number(config.get('THROTTLE_LIMIT') ?? 10) },
          { name: REFRESH_THROTTLER, ttl, limit: Number(config.get('REFRESH_THROTTLE_LIMIT') ?? 60) },
        ]
      },
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: resolveJwtSecret(config),
        signOptions: {
          expiresIn: getAccessTokenTtl(config) as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
