import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule } from 'src/config/config.module';
import { StorageController } from './storage.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [StorageService],
  imports: [ConfigModule, HttpModule],
  controllers: [StorageController],
  exports: [StorageService]
})
export class StorageModule {}
