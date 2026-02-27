/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PositionsService } from './positions.service';
import { PositionResponseDto } from './dto/position.response';

@ApiTags('Positions')
@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get('risky')
  @ApiOperation({ summary: 'Get risky positions (low health factor)' })
  async getRisky() {
    return this.positionsService.getRiskyPositions();
  }

  @Get(':wallet')
  @ApiOperation({ summary: 'Get all positions for a given wallet' })
  async getPosition(
    @Param('wallet') wallet: string,
  ): Promise<PositionResponseDto> {
    return this.positionsService.getPositionByWallet(wallet);
  }
}
