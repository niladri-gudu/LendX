import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LiquidationService } from './liquidation.service';
import { LiquidationPreviewResponseDto } from './dto/liquidation-preview.response';

@ApiTags('Liquidation')
@Controller('liquidation')
export class LiquidationController {
  constructor(private readonly liquidationService: LiquidationService) {}

  @Get('preview/:wallet')
  @ApiOperation({ summary: 'Get liquidation preview for a wallet' })
  @ApiResponse({
    status: 200,
    description: 'Liquidation preview',
    type: LiquidationPreviewResponseDto,
  })
  async preview(
    @Param('wallet') wallet: string,
  ): Promise<LiquidationPreviewResponseDto> {
    return this.liquidationService.preview(wallet);
  }
}
