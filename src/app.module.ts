import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { TypeormModule } from './typeorm/typeorm.module';
import { UserModule } from './user/user.module';
import { AlarmModule } from './alarm/alarm.module';
import { VoiceModule } from './voice/voice.module';
import { EtcModule } from './etc/etc.module';
import { StorageModule } from './storage/storage.module';
import * as configModule from '@nestjs/config';
import './extension/extension';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from './config/config.service';
import { ContactModule } from './contact/contact.module';
import { FaqModule } from './faq/faq.module';
import { NoticeModule } from './notice/notice.module';



@Module({
  controllers: [],
  providers: [],
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (service: ConfigService) => await service.getRedisConfig()
    }),
    configModule.ConfigModule.forRoot(),
    TypeormModule.forRoot(),
    AuthModule, 
    ConfigModule, 
    UserModule, 
    AlarmModule, 
    VoiceModule, 
    EtcModule, 
    StorageModule, 
    ContactModule, 
    FaqModule,
    NoticeModule
  ],
})
export class AppModule {}
