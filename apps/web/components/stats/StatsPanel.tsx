'use client';

import { useStats } from '../../hooks/useStats';

export default function StatsPanel() {
  const { data, isLoading } = useStats();

  if (isLoading) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Stat label="TVL" value={`$${data.tvlUsd.toLocaleString()}`} />
      <Stat label="Total Debt" value={`$${data.totalDebtUsd.toLocaleString()}`} />
      <Stat label="Utilization" value={`${(data.utilization * 100).toFixed(2)}%`} />
      <Stat label="Active Users" value={data.activeUsers} />
    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <p className="text-zinc-400 text-xs">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}