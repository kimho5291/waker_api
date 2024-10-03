import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from './notice.entity';

@Module({
  providers: [NoticeService],
  controllers: [NoticeController],
  imports: [TypeOrmModule.forFeature([NoticeEntity])]
})
export class NoticeModule {}
