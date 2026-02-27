import { Module } from '@nestjs/common';
import { LiquidationController } from './liquidation.controller';
import { LiquidationService } from './liquidation.service';

@Module({
  controllers: [LiquidationController],
  providers: [LiquidationService],
})
export class LiquidationModule {}
