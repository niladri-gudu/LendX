'use client';

import { useConnection } from 'wagmi';
import { usePosition } from '../../hooks/usePosition';

export default function PositionCard() {
  const { address } = useConnection();
  const { data, isLoading } = usePosition(address!);
  
  if (!address) return null;

  if (isLoading) return <Card>Loading position...</Card>;

  const health = data?.healthFactor ?? 0;

  const healthColor =
    health > 1.5 ? 'text-green-400' : health > 1 ? 'text-yellow-400' : 'text-red-500';

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Your Position</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Row label="Collateral (ETH)" value={data.collateralETH} />
        <Row label="Debt (USDC)" value={data.debtUsdc} />
        <Row label="LTV" value={`${(data.ltv * 100).toFixed(2)}%`} />
        <Row
          label="Health Factor"
          value={<span className={healthColor}>{health.toFixed(2)}</span>}
        />
      </div>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
      
      <div className="relative rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-6 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between">
      <span className="text-zinc-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}