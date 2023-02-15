import { Module } from '@nestjs/common';
import { NestapiService } from './nestapi.service';
import { NestapiController } from './nestapi.controller';

@Module({
  controllers: [NestapiController],
  providers: [NestapiService]
})
export class NestapiModule {}
