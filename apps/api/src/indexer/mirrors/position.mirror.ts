/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PositionService } from '../services/position.service';

const ETH_PRICE_USD = 2000;
const LIQ_THRESHOLD = 0.8;

export class PositionMirror {
  private service = new PositionService();

  async recompute(userId: string) {
    const txs = await this.service.getUserTransactions(userId);

    let collateralETH = 0;
    let debtUSDC = 0;

    for (const tx of txs) {
      const amount = Number(tx.amount);

      switch (String(tx.action)) {
        case 'DEPOSIT':
          collateralETH += amount;
          break;
        case 'WITHDRAW':
          collateralETH -= amount;
          break;
        case 'BORROW':
          debtUSDC += amount / 1e6;
          break;
        case 'REPAY':
          debtUSDC -= amount / 1e6;
          break;
      }
    }

    collateralETH = Math.max(collateralETH, 0);
    debtUSDC = Math.max(debtUSDC, 0);

    const collateralUSD = collateralETH * ETH_PRICE_USD;

    const ltv = collateralUSD === 0 ? 0 : debtUSDC / collateralUSD;

    let healthFactor = Number.MAX_SAFE_INTEGER;

    if (debtUSDC > 0) {
      healthFactor = (collateralUSD * LIQ_THRESHOLD) / debtUSDC;
    }

    console.log('Computed debt:', debtUSDC);

    await this.service.upsertPosition({
      userId,
      collateralEth: collateralETH,
      debtUsdc: debtUSDC,
      collateralUsd: collateralUSD,
      ltv,
      healthFactor,
      blockNumber: txs.length > 0 ? txs[txs.length - 1].blockNumber : 0,
    });
  }
}
