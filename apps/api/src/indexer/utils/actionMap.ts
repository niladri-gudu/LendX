import { ActionType } from '@repo/db';

export const eventToAction: Record<string, ActionType> = {
  Deposit: ActionType.DEPOSIT,
  Withdraw: ActionType.WITHDRAW,
  Borrow: ActionType.BORROW,
  Repay: ActionType.REPAY,
  Liquidation: ActionType.LIQUIDATE,
};
