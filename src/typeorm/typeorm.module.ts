import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


import { UserSsoEntity } from 'src/auth/auth.entity';
import { UserEntity } from 'src/user/user.entity';
import { BasicAlarmVoiceEntity, UserVoiceEntity, UserVoiceShareEntity } from 'src/voice/voice.entity';
import { AlarmEntity, AlarmVoiceEntity } from 'src/alarm/alarm.entity';
import { FaqEntity } from 'src/faq/faq.entity';
import { NoticeEntity } from 'src/notice/notice.entity';
import { UserContactCommentEntity, UserContactEntity } from 'src/contact/contact.entity';
import { DailyForecastEntity, ForecastEntity, RegionEntity } from 'src/alarm/information/weather.entity';
import { NewsEntity } from 'src/alarm/information/news.entity';


@Module({})
export class TypeormModule {

  static forRoot(): DynamicModule {
    const typeormModule: DynamicModule = TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<MysqlConnectionOptions> => (
        Object.assign(
          await configService.getDatabaseConfig(),
          { 
            entities: [
              UserSsoEntity,
              UserEntity,
              UserVoiceEntity,
              UserVoiceShareEntity,
              FaqEntity,
              AlarmEntity,
              AlarmVoiceEntity,
              BasicAlarmVoiceEntity,
              NoticeEntity,
              UserContactEntity,
              UserContactCommentEntity,
              RegionEntity,
              ForecastEntity,
              DailyForecastEntity,
              NewsEntity,
            ]
          }
        )
      ),
    
    });

    return {
      module: TypeOrmModule,
      imports: [typeormModule],
      exports: [typeormModule],
    };
  }
}