import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';
import { ActionType } from '@repo/db';

@Injectable()
export class TransactionsService {
  async getUserHistory(
    wallet: string,
    limit = 20,
    offset = 0,
    action?: ActionType,
  ) {
    const normalizedWallet = wallet.toLowerCase();
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safeOffset = Math.max(offset, 0);

    const user = await prisma.user.findUnique({
      where: { walletAddress: normalizedWallet },
    });

    if (!user) {
      return {
        items: [],
        pagination: { limit: safeLimit, offset: safeOffset, count: 0 },
      };
    }

    const [txs, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: user.id,
          ...(action ? { action } : {}),
        },
        orderBy: { timestamp: 'desc' },
        take: safeLimit,
        skip: safeOffset,
      }),
      prisma.transaction.count({
        where: {
          userId: user.id,
          ...(action ? { action } : {}),
        },
      }),
    ]);

    const items = txs.map((tx) => ({
      action: tx.action,
      amount: Number(tx.amount),
      txHash: tx.txHash,
      timestamp: tx.timestamp,
    }));

    return {
      items,
      pagination: {
        limit: safeLimit,
        offset: safeOffset,
        count: totalCount,
      },
    };
  }
}
