import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserContactCommentEntity, UserContactEntity } from './contact.entity';
import { ConfigModule } from 'src/config/config.module';



@Module({
  controllers: [ContactController],
  providers: [ContactService],
  imports: [ConfigModule, TypeOrmModule.forFeature([UserContactCommentEntity, UserContactEntity])],
})
export class ContactModule {}
