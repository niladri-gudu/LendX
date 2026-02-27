import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { ActionType } from '@repo/db';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly txService: TransactionsService) {}

  @Get(':wallet')
  @ApiOperation({ summary: 'Get user transaction history' })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  @ApiQuery({
    name: 'action',
    required: false,
    enum: ActionType,
    example: 'BORROW',
  })
  async getHistory(
    @Param('wallet') wallet: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('action') action?: ActionType,
  ) {
    return this.txService.getUserHistory(
      wallet,
      Number(limit) || 20,
      Number(offset) || 0,
      action,
    );
  }
}
