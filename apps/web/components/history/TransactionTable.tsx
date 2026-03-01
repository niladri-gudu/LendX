"use client";

import {
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Repeat,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Transaction {
  action: "DEPOSIT" | "BORROW" | "WITHDRAW" | "REPAY";
  amount: number;
  txHash: string;
  timestamp: string;
}

interface Pagination {
  limit: number;
  offset: number;
  count: number;
}

export default function TransactionTable({
  transactions,
  pagination,
  onPageChange,
}: {
  transactions: Transaction[];
  pagination: Pagination;
  onPageChange: (newOffset: number) => void;
}) {
  const getActionStyles = (action: string) => {
    switch (action) {
      case "DEPOSIT":
        return {
          icon: <ArrowDownLeft className="text-emerald-400" />,
          bg: "bg-emerald-500/10",
          text: "text-emerald-400",
        };
      case "BORROW":
        return {
          icon: <ArrowUpRight className="text-indigo-400" />,
          bg: "bg-indigo-500/10",
          text: "text-indigo-400",
        };
      case "REPAY":
        return {
          icon: <Repeat className="text-orange-400" />,
          bg: "bg-orange-500/10",
          text: "text-orange-400",
        };
      default:
        return {
          icon: <Wallet className="text-zinc-400" />,
          bg: "bg-zinc-500/10",
          text: "text-zinc-400",
        };
    }
  };

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.count / pagination.limit);

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto rounded-2xl border border-white/5 bg-zinc-900/30 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Transaction Hash</th>
              <th className="px-6 py-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx, i) => {
              const style = getActionStyles(tx.action);
              const date = new Date(tx.timestamp).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr
                  key={i}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${style.bg}`}>
                        {style.icon}
                      </div>
                      <span className={`text-sm font-bold ${style.text}`}>
                        {tx.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono font-medium text-zinc-200">
                    {tx.amount}{" "}
                    {tx.action === "BORROW" || tx.action === "REPAY"
                      ? "USDC"
                      : "ETH"}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} // Fixed: tx.hash to tx.txHash
                      target="_blank"
                      className="flex items-center gap-2 text-xs text-zinc-500 hover:text-indigo-400 transition-colors font-mono"
                    >
                      {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-zinc-500 font-medium">
                    {date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-zinc-500">
          Showing <span className="text-zinc-300">{pagination.offset + 1}</span>{" "}
          to{" "}
          <span className="text-zinc-300">
            {Math.min(pagination.offset + pagination.limit, pagination.count)}
          </span>{" "}
          of <span className="text-zinc-300">{pagination.count}</span> results
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.offset - pagination.limit)}
            disabled={pagination.offset === 0}
            className="p-2 cursor-pointer rounded-lg bg-zinc-800 border border-white/5 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-zinc-400 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.offset + pagination.limit)}
            disabled={pagination.offset + pagination.limit >= pagination.count}
            className="p-2 cursor-pointer rounded-lg bg-zinc-800 border border-white/5 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
