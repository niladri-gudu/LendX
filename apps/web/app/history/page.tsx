"use client";

import { useState } from "react";
import { useConnection } from "wagmi";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet2, ShieldAlert, History } from "lucide-react";
import { useTransactions } from "../../hooks/useTransactions";
import TransactionTable from "../../components/history/TransactionTable";
import WalletConnect from "../../components/wallet/WalletConnect";

export default function HistoryPage() {
  const { address, isConnected } = useConnection();
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const LIMIT = 10;

  const { data, isLoading, isFetching } = useTransactions(
    address as string,
    LIMIT,
    offset
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
          Please connect your wallet to view your historical interactions,
          transaction hashes, and past protocol activity.
        </p>

        <div className="scale-110">
          <WalletConnect />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 text-xs text-zinc-400">
            <ShieldAlert className="w-4 h-4 mb-2 text-indigo-400" />
            Verified Transaction Data
          </div>
          <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 text-xs text-zinc-400">
            <Wallet2 className="w-4 h-4 mb-2 text-indigo-400" />
            Multi-asset History
          </div>
          <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 text-xs text-zinc-400">
            <ShieldAlert className="w-4 h-4 mb-2 text-indigo-400" />
            Etherscan Verification
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition uppercase tracking-widest mb-4"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white tracking-tight italic">
            Transaction History
          </h1>
          <p className="text-zinc-500 mt-1">
            All your interactions with the Lending Pool on Sepolia.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
            Total Actions
          </p>
          <p className="text-xl font-mono font-bold text-white">
            {data?.pagination.count || 0}
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Records
          </h2>
          {isFetching && (
            <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold uppercase">
              <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Syncing
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-full h-16 bg-zinc-900/50 rounded-xl animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : data && data.items.length > 0 ? (
          <TransactionTable
            transactions={data.items}
            pagination={data.pagination}
            onPageChange={(newOffset) => setOffset(newOffset)}
          />
        ) : (
          <div className="py-20 text-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl">
            <History className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500">No transactions recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}