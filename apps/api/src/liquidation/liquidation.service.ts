import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class LiquidationService {
  private readonly LIQ_THRESHOLD = 0.8;
  private readonly LIQ_BONUS = 0.05;
  private readonly CLOSE_FACTOR = 0.5;

  async preview(wallet: string) {
    const normalizedWallet = wallet.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { walletAddress: normalizedWallet },
    });

    if (!user) {
      return this.empty(normalizedWallet);
    }

    const position = await prisma.position.findUnique({
      where: { userId: user.id },
    });

    if (!position) {
      return this.empty(normalizedWallet);
    }

    const collateralUsd = Number(position.collateralUsd);
    const debtUsd = Number(position.debtUsdc);
    const collateralEth = Number(position.collateralEth);

    const rawHF =
      debtUsd === 0 ? 999 : (collateralUsd * this.LIQ_THRESHOLD) / debtUsd;

    const healthFactor = Number(rawHF.toFixed(4));

    const liquidatable = healthFactor < 1;

    if (!liquidatable) {
      return {
        wallet: normalizedWallet,
        healthFactor,
        liquidatable: false,
        maxRepayUsd: 0,
        seizableEth: 0,
        bonusPercent: this.LIQ_BONUS * 100,
      };
    }

    const maxRepayUsd = debtUsd * this.CLOSE_FACTOR;

    const seizeUsd = maxRepayUsd * (1 + this.LIQ_BONUS);

    const ethPrice = collateralEth > 0 ? collateralUsd / collateralEth : 0;

    const seizableEth =
      ethPrice > 0 ? Number((seizeUsd / ethPrice).toFixed(6)) : 0;

    return {
      wallet: normalizedWallet,
      healthFactor,
      liquidatable: true,
      maxRepayUsd: Number(maxRepayUsd.toFixed(2)),
      seizableEth,
      bonusPercent: this.LIQ_BONUS * 100,
    };
  }

  private empty(wallet: string) {
    return {
      wallet,
      healthFactor: 0,
      liquidatable: false,
      maxRepayUsd: 0,
      seizableEth: 0,
      bonusPercent: this.LIQ_BONUS * 100,
    };
  }
}
