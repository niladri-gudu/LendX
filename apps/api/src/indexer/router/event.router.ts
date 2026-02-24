import { RoutedLog } from './event.types';

import { DepositHandler } from '../handlers/deposit.handler';
import { WithdrawHandler } from '../handlers/withdraw.handler';
import { BorrowHandler } from '../handlers/borrow.handler';
import { RepayHandler } from '../handlers/repay.handler';
import { LiquidationHandler } from '../handlers/liquidation.handler';

export class EventRouter {
  private deposit = new DepositHandler();
  private withdraw = new WithdrawHandler();
  private borrow = new BorrowHandler();
  private repay = new RepayHandler();
  private liquidation = new LiquidationHandler();

  async route(log: RoutedLog) {
    switch (log.eventName) {
      case 'Deposit':
        return this.deposit.handle(log);
      case 'Withdraw':
        return this.withdraw.handle(log);
      case 'Borrow':
        return this.borrow.handle(log);
      case 'Repay':
        return this.repay.handle(log);
      case 'Liquidation':
        return this.liquidation.handle(log);
      default:
        console.warn('Unknown event:', log.eventName);
    }
  }
}
