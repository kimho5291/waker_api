import { Module } from '@nestjs/common';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';
import { StorageModule } from 'src/storage/storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasicAlarmVoiceEntity, UserVoiceEntity, UserVoiceShareEntity } from './voice.entity';

@Module({
  controllers: [VoiceController],
  providers: [VoiceService],
  imports: [StorageModule, TypeOrmModule.forFeature([UserVoiceEntity, UserVoiceShareEntity, BasicAlarmVoiceEntity])]
})
export class VoiceModule {}
