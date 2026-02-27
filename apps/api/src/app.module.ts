/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { IndexerModule } from './indexer/indexer.module';
import { PositionsModule } from './positions/positions.module';
import { StatsModule } from './stats/stats.module';
import { TransactionsModule } from './transactions/transactions.module';
import { HealthModule } from './health/health.module';
import { LiquidationModule } from './liquidation/liquidation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    IndexerModule,
    PositionsModule,
    StatsModule,
    TransactionsModule,
    LiquidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
