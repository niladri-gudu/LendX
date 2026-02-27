import { ApiProperty } from '@nestjs/swagger';

export class IndexerStatusResponseDto {
  @ApiProperty({ example: 10342344 })
  lastIndexedBlock: number;

  @ApiProperty({ example: 10342360 })
  chainHead: number;

  @ApiProperty({ example: 16 })
  lag: number;

  @ApiProperty({ example: true })
  isHealthy: boolean;

  @ApiProperty({ example: false })
  synced: boolean;
}
