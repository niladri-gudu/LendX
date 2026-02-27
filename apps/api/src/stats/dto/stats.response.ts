import { ApiProperty } from '@nestjs/swagger';

export class StatsOverviewResponseDto {
  @ApiProperty({
    description: 'Total value locked in USD',
    example: 125000.45,
  })
  tvlUsd: number;

  @ApiProperty({
    description: 'Total outstanding debt in USD',
    example: 54000.12,
  })
  totalDebtUsd: number;

  @ApiProperty({
    description: 'Protocol utilization ratio (debt / TVL)',
    example: 0.43,
  })
  utilization: number;

  @ApiProperty({
    description: 'Number of active users with open positions',
    example: 128,
  })
  activeUsers: number;

  @ApiProperty({
    description: 'Total liquidation events',
    example: 12,
  })
  liquidations: number;
}