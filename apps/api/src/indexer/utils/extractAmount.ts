import { RoutedLog } from '../router/event.types';
import { formatUnits } from 'viem';

export function extractAmount(log: RoutedLog): number {
  let raw: bigint | undefined;

  if (log.eventName === 'Liquidate') {
    raw = log.args?.repayAmount as bigint | undefined;
  } else {
    raw = log.args?.amount as bigint | undefined;
  }

  if (raw === undefined) {
    throw new Error(`Missing amount in ${log.eventName} log ${log.txHash}`);
  }

  switch (log.eventName) {
    case 'Deposit':
    case 'Withdraw':
      return Number(formatUnits(raw, 18));

    case 'Borrow':
    case 'Repay':
    case 'Liquidate':
      return Number(formatUnits(raw, 6));

    default:
      return Number(raw);
  }
}
