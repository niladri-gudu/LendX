"use client";

import { useConnection } from "wagmi";
import StatsPanel from "../../components/stats/StatsPanel";
import PositionCard from "../../components/positions/PositionCard";
import ActionPanel from "../../components/actions/ActionPanel";
import WalletConnect from "../../components/wallet/WalletConnect";
import { Wallet2, ShieldAlert } from "lucide-react";
import { useTransactions } from "../../hooks/useTransactions";
import TransactionTable from "../../components/history/TransactionTable";
import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const { address, isConnected } = useConnection();
  const [offset, setOffset] = useState(0);
  const LIMIT = 5;

  const { data, isFetching, isLoading } = useTransactions(
    address as string,
    LIMIT,
    offset,
  );

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-700">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="relative w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
            <Wallet2 className="w-10 h-10 text-indigo-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">Connect your wallet</h1>
        <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed">
          Please connect your wallet to view your portfolio, manage collateral,
          and monitor your health factor.
        </p>

        <div className="scale-110">
          <WalletConnect />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 text-xs text-zinc-400">
            <ShieldAlert className="w-4 h-4 mb-2 text-indigo-400" />
            Personalized Risk Metrics
          </div>
          <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 text-xs text-zinc-400">
            <Wallet2 className="w-4 h-4 mb-2 text-indigo-400" />
            Real-time Collateral Tracking
          </div>
          <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 text-xs text-zinc-400">
            <ShieldAlert className="w-4 h-4 mb-2 text-indigo-400" />
            Instant Borrowing Access
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-10 animate-in fade-in duration-700">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 ml-1">
            Global Market Overview
          </h2>
          <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded uppercase tracking-tighter">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Sepolia Live Feed
          </div>
        </div>
        <StatsPanel />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 ml-1">
              My Portfolio
            </h2>
            <PositionCard />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Recent Activity
              </h2>
              <div className="flex items-center gap-4">
                {isFetching && !isLoading && (
                  <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                )}
                <Link
                  href="/history"
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition uppercase tracking-widest"
                >
                  View Full History →
                </Link>
              </div>
            </div>

            {isLoading ? (
              <div className="w-full h-48 bg-zinc-900/30 rounded-2xl border border-white/5 animate-pulse flex items-center justify-center">
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
                  Loading Records...
                </p>
              </div>
            ) : data && data.items.length > 0 ? (
              <TransactionTable
                transactions={data.items}
                pagination={data.pagination}
                onPageChange={(newOffset) => setOffset(newOffset)}
              />
            ) : (
              <div className="w-full h-48 bg-zinc-900/30 rounded-2xl border border-white/5 flex items-center justify-center text-zinc-500">
                No transactions found
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <ActionPanel />
        </div>
      </div>
    </div>
  );
}
