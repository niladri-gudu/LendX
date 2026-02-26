/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma } from '@repo/db';
import { EventHandler } from './base.handler';
import { RoutedLog } from '../router/event.types';

import { eventToAction } from '../utils/actionMap';
import { PositionMirror } from '../mirrors/position.mirror';
import { extractAmount } from '../utils/extractAmount';

const mirror = new PositionMirror();

export class LiquidationHandler implements EventHandler {
  async handle(log: RoutedLog) {
    const action = eventToAction[log.eventName];

    const borrower = log.args.user.toLowerCase();

    const repayAmount = extractAmount(log);

    if (!borrower) {
      console.warn('Liquidation missing borrower', log.txHash);
      return;
    }

    const { txHash, logIndex, blockNumber, timestamp } = log;

    const user = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { walletAddress: borrower },
        update: {},
        create: { walletAddress: borrower },
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
          amount: repayAmount,
          blockNumber,
          timestamp: new Date(timestamp * 1000),
        },
      });

      return user as { id: string; walletAddress: string };
    });

    await mirror.recompute(user.id as string);
    console.log('Liquidation handler', log.txHash, log.logIndex);
  }
}
