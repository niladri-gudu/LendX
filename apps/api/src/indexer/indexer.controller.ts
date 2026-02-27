import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { IndexerService } from './indexer.service';
import { IndexerStatusResponseDto } from './dto/indexer-status.response';

@ApiTags('Indexer')
@Controller('indexer')
export class IndexerController {
  constructor(private readonly indexerService: IndexerService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get indexer sync status' })
  @ApiResponse({
    status: 200,
    description: 'Indexer health and sync info',
    type: IndexerStatusResponseDto,
  })
  async getStatus(): Promise<IndexerStatusResponseDto> {
    return this.indexerService.getStatus();
  }
}
