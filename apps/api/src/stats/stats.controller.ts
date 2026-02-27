import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { StatsOverviewResponseDto } from './dto/stats.response';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Protocol overview metrics' })
  @ApiResponse({
    status: 200,
    description: 'Aggregated protocol statistics',
    type: StatsOverviewResponseDto,
  })
  async getOverview(): Promise<StatsOverviewResponseDto> {
    return this.statsService.getOverview();
  }
}