import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { IndexerModule } from 'src/indexer/indexer.module';

@Module({
  imports: [IndexerModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
