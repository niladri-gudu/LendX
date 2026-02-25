/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createPublicClient, http, formatUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { PositionService } from '../services/position.service';
import { contracts } from '@repo/contracts';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_URL),
});

const LIQ_THRESHOLD = 0.8;

export class PositionMirror {
  private service = new PositionService();

  private async getETHPriceUSD(): Promise<number> {
    const raw = await publicClient.readContract({
      address: contracts.PriceOracle.address,
      abi: contracts.PriceOracle.abi,
      functionName: 'getETHPrice',
    });

    const price = Number(formatUnits(raw as bigint, 8));
    return price;
  }

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
          debtUSDC += amount;
          break;
        case 'REPAY':
          debtUSDC -= amount;
          break;
      }
    }

    collateralETH = Math.max(collateralETH, 0);
    debtUSDC = Math.max(debtUSDC, 0);

    const ethPriceUSD = await this.getETHPriceUSD();

    const collateralUSD = collateralETH * ethPriceUSD;

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
