/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma } from '@repo/db';

export class PositionService {
  getPositionByWallet: any;
  async getUserTransactions(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: [{ blockNumber: 'asc' }, { logIndex: 'asc' }],
    });
  }

  async upsertPosition(data: {
    userId: string;
    collateralEth: number;
    debtUsdc: number;
    collateralUsd: number;
    ltv: number;
    healthFactor: number;
    blockNumber: number;
  }) {
    return prisma.position.upsert({
      where: { userId: data.userId },
      create: {
        userId: data.userId,
        collateralEth: data.collateralEth,
        debtUsdc: data.debtUsdc,
        collateralUsd: data.collateralUsd,
        ltv: data.ltv,
        healthFactor: data.healthFactor,
        blockNumber: data.blockNumber,
      },
      update: {
        collateralEth: data.collateralEth,
        debtUsdc: data.debtUsdc,
        collateralUsd: data.collateralUsd,
        ltv: data.ltv,
        healthFactor: data.healthFactor,
        blockNumber: data.blockNumber,
      },
    });
  }
}
