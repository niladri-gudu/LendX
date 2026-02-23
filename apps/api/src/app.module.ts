import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexerModule } from './indexer/indexer.module';

@Module({
  imports: [IndexerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
