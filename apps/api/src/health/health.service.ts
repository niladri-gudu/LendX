import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';
import { IndexerService } from 'src/indexer/indexer.service';

@Injectable()
export class HealthService {
  constructor(private readonly indexerService: IndexerService) {}

  async check() {
    const api = 'ok';

    let db = 'ok';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      console.error('Database connection error:', error);
      db = 'error';
    }

    let indexer = 'unknown';
    try {
      const status = await this.indexerService.getStatus();
      indexer = status.isHealthy ? 'Healthy' : 'degraded';
    } catch (error) {
      console.error('Indexer status error:', error);
      indexer = 'error';
    }

    return {
      api,
      db,
      indexer,
      timestamp: new Date().toISOString(),
    };
  }
}
