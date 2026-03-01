'use client';

import { useConnection } from 'wagmi';
import { useLiquidation } from '../../hooks/useLiquidation';

export default function LiquidationCard() {
  const { address } = useConnection();
  const { data } = useLiquidation(address);

  if (!address || !data) return null;

  const badge = data.liquidatable
    ? 'bg-red-600 text-white'
    : 'bg-green-600 text-white';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Liquidation Risk</h2>

      <span className={`px-3 py-1 rounded-full text-xs ${badge}`}>
        {data.liquidatable ? 'Liquidatable' : 'Safe'}
      </span>

      <div className="mt-4 text-sm space-y-2">
        <p>Health Factor: {data.healthFactor}</p>
        <p>Max Repay: ${data.maxRepayUsd}</p>
        <p>Seizable ETH: {data.seizableEth}</p>
        <p>Bonus: {data.bonusPercent}%</p>
      </div>
    </div>
  );
}