import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './strategies/auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => {
        console.log('🔍 JWT_SECRET 환경변수 값:', process.env.JWT_SECRET);
        console.log(
          '🔍 JWT_SECRET이 undefined인가?',
          process.env.JWT_SECRET === undefined,
        );
        console.log(
          '🔍 JWT_SECRET이 null인가?',
          process.env.JWT_SECRET === null,
        );
        console.log(
          '🔍 JWT_SECRET이 빈 문자열인가?',
          process.env.JWT_SECRET === '',
        );
        return {
          secret: process.env.JWT_SECRET || 'secret_key',
          signOptions: {
            expiresIn: '1m',
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    UserService,
    JwtStrategy,
    GoogleStrategy,
    KakaoStrategy,
    EmailService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
