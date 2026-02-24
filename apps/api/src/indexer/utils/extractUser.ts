/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RoutedLog } from '../router/event.types';

export function extractUser(log: RoutedLog): `0x${string}` | null {
  const user = log.args?.user;

  if (!user) return null;

  return user.toLowerCase() as `0x${string}`;
}
