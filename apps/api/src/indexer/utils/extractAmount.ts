import { RoutedLog } from '../router/event.types';
import { formatUnits } from 'viem';

export function extractAmount(log: RoutedLog): number {
  const raw = log.args?.amount as bigint | undefined;

  if (raw === undefined) {
    throw new Error(`Missing amount in ${log.eventName} log ${log.txHash}`);
  }

  switch (log.eventName) {
    case 'Deposit':
    case 'Withdraw':
      return Number(formatUnits(raw, 18));

    case 'Borrow':
    case 'Repay':
      return Number(formatUnits(raw, 6));

    default:
      return Number(raw);
  }
}
