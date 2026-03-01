/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RoutedLog } from '../router/event.types';

export function extractUser(log: RoutedLog): `0x${string}` | null {
  const raw = log.args?.user ?? log.args?.borrower ?? log.args?.liquidator;

  if (!raw) return null;

  return raw.toLowerCase() as `0x${string}`;
}
