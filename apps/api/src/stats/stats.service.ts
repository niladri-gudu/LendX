/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class StatsService {
  async getOverview() {
    const positions = await prisma.position.findMany();

    const tvl = positions.reduce((sum, p) => sum + Number(p.collateralUsd), 0);

    const totalBorrowed = positions.reduce(
      (sum, p) => sum + Number(p.debtUsdc),
      0,
    );

    const utilization = tvl === 0 ? 0 : totalBorrowed / tvl;

    const activeUsers = positions.length;

    const liquidations = await prisma.transaction.count({
      where: { action: 'LIQUIDATE' },
    });

    return {
      tvlUsd: tvl,
      totalDebtUsd: totalBorrowed,
      utilization,
      activeUsers,
      liquidations,
    };
  }
}
