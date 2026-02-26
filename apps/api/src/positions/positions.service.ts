/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';
import { PositionResponseDto } from './dto/position.response';

@Injectable()
export class PositionsService {
  async getPositionByWallet(wallet: string): Promise<PositionResponseDto> {
    const normalizedWallet = wallet.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { walletAddress: normalizedWallet },
    });

    if (!user) {
      return emptyPosition(normalizedWallet);
    }

    const position = await prisma.position.findUnique({
      where: { userId: user.id },
    });

    if (!position) {
      return emptyPosition(normalizedWallet);
    }

    return {
      wallet: normalizedWallet,
      collateralETH: Number(position.collateralEth),
      debtUsdc: Number(position.debtUsdc),
      collateralUsd: Number(position.collateralUsd),
      ltv: Number(position.ltv),
      healthFactor: Number(position.healthFactor),
      updatedAt: position.updatedAt,
    };
  }

  async getRiskyPositions(limit = 50) {
    const positions = await prisma.position.findMany({
      where: {
        healthFactor: { lt: 1.5 },
      },
      orderBy: {
        healthFactor: 'asc',
      },
      take: limit,
      include: {
        user: true,
      },
    });

    return positions.map((p) => ({
      wallet: p.user.walletAddress,
      healthFactor: Number(p.healthFactor),
      debtUsdc: Number(p.debtUsdc),
      collateralUsd: Number(p.collateralUsd),
    }));
  }

  async getUserHistory(wallet: string) {
    const normalizedWallet = wallet.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { walletAddress: normalizedWallet },
    });

    if (!user) return [];

    const txs = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    return txs.map((tx) => ({
      action: tx.action,
      amount: Number(tx.amount),
      txHash: tx.txHash,
      timestamp: tx.timestamp,
    }));
  }
}

function emptyPosition(wallet: string): PositionResponseDto {
  return {
    wallet,
    collateralETH: 0,
    debtUsdc: 0,
    collateralUsd: 0,
    ltv: 0,
    healthFactor: 0,
    updatedAt: new Date(0),
  };
}
