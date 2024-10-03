import { Module } from '@nestjs/common';
import { EtcController } from './etc.controller';
import { ConfigModule } from 'src/config/config.module';


@Module({
  providers: [],
  controllers: [EtcController],
  imports: [ConfigModule]
})
export class EtcModule {}
