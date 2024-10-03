import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmEntity, AlarmVoiceEntity } from './alarm.entity';
import { StorageModule } from 'src/storage/storage.module';
import { WeatherService } from './information/weather.service'
import { ConfigModule } from 'src/config/config.module';
import { DailyForecastEntity, ForecastEntity, RegionEntity } from './information/weather.entity';
import { HttpModule } from '@nestjs/axios';
import { NewsService } from './information/news.service';
import { NewsEntity } from './information/news.entity';

@Module({
  providers: [AlarmService, WeatherService, NewsService],
  controllers: [AlarmController],
  imports: [HttpModule, ConfigModule, StorageModule, TypeOrmModule.forFeature([NewsEntity, AlarmEntity, AlarmVoiceEntity, RegionEntity, ForecastEntity, DailyForecastEntity])]
})
export class AlarmModule {}
