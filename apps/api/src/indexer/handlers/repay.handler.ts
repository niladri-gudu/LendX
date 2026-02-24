/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma } from '@repo/db';
import { EventHandler } from './base.handler';
import { RoutedLog } from '../router/event.types';

import { eventToAction } from '../utils/actionMap';
import { extractUser } from '../utils/extractUser';
import { extractAmount } from '../utils/extractAmount';
import { PositionMirror } from '../mirrors/position.mirror';

const mirror = new PositionMirror();

export class RepayHandler implements EventHandler {
  async handle(log: RoutedLog) {
    const action = eventToAction[log.eventName];

    const walletAddress = extractUser(log);
    const amount = extractAmount(log);

    if (!walletAddress) {
      console.warn('Repay missing wallet', log.txHash);
      return;
    }

    const { txHash, logIndex, blockNumber, timestamp } = log;

    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { walletAddress },
        update: {},
        create: { walletAddress },
      });

      await tx.transaction.upsert({
        where: {
          txHash_logIndex: { txHash, logIndex },
        },
        update: {},
        create: {
          txHash,
          logIndex,
          userId: user.id,
          action,
          amount,
          blockNumber,
          timestamp: new Date(timestamp * 1000),
        },
      });

      return user as { id: string; walletAddress: string };
    });

    await mirror.recompute(user.id as string);

    console.log('Repay handler', log.txHash, log.logIndex);
  }
}
