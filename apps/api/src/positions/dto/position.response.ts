/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';

export class PositionResponseDto {
  @ApiProperty()
  wallet: string;

  @ApiProperty()
  collateralETH: number;

  @ApiProperty()
  debtUsdc: number;

  @ApiProperty()
  collateralUsd: number;

  @ApiProperty()
  ltv: number;

  @ApiProperty()
  healthFactor: number;

  @ApiProperty()
  updatedAt: Date;
}
