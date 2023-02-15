import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestapiModule } from './nestapi/nestapi.module';

@Module({
  imports: [NestapiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
