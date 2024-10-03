import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from 'src/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { KakaoFactory } from './oauth/kakao.factory';
import { HttpModule } from '@nestjs/axios';
import { UserSsoEntity } from './auth.entity';
import { NaverFactory } from './oauth/naver.factory';
import { GoogleFactory } from './oauth/google.factory';

@Module({
  imports: [ConfigModule, HttpModule,TypeOrmModule.forFeature([UserEntity, UserSsoEntity]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService, KakaoFactory, NaverFactory, GoogleFactory]
})
export class AuthModule {}
