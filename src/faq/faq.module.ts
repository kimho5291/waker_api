import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { FaqEntity } from './faq.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([FaqEntity])],
  providers: [FaqService],
  controllers: [FaqController]
})
export class FaqModule {}
