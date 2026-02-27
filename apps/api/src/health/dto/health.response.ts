import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  api: string;

  @ApiProperty({ example: 'ok' })
  db: string;

  @ApiProperty({ example: 'healthy' })
  indexer: string;

  @ApiProperty({ example: '2026-02-27T10:00:00.000Z' })
  timestamp: string;
}
