import { ApiProperty } from '@nestjs/swagger';

export class LiquidationPreviewResponseDto {
  @ApiProperty({ example: '0x1234567890abcdef1234567890abcdef12345678' })
  wallet: string;

  @ApiProperty({ example: 0.92 })
  healthFactor: number;

  @ApiProperty({ example: true })
  liquidatable: boolean;

  @ApiProperty({ example: 450 })
  maxRepayUsd: number;

  @ApiProperty({ example: 0.18 })
  seizableEth: number;

  @ApiProperty({ example: 5 })
  bonusPercent: number;
}
