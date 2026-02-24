import { RoutedLog } from '../router/event.types';
import { formatUnits } from 'viem';

export function extractAmount(log: RoutedLog): string {
  const raw = log.args?.amount as bigint | undefined;

  if (raw === undefined) {
    throw new Error(`Missing amount in ${log.eventName} log ${log.txHash}`);
  }

  return formatUnits(raw, 18);
}
