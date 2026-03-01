"use client";

import { useState } from "react";
import { useLendingActions } from "../../hooks/useLendingActions";
import TokenInput from "./TokenInput";

export default function DepositForm() {
  const [amount, setAmount] = useState("");
  const { deposit, isBusy } = useLendingActions();

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) return;
    const success = await deposit(amount);
    if (success) setAmount("");
  };

  return (
    <div className="space-y-4">
      <TokenInput value={amount} setValue={setAmount} symbol="ETH" />

      <button
        onClick={handleDeposit}
        disabled={isBusy || !amount}
        className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] disabled:bg-zinc-700 disabled:opacity-70 disabled:cursor-not-allowed py-3 rounded-xl font-semibold text-white transition-all"
      >
        {isBusy ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="opacity-90">Processing...</span>
          </>
        ) : (
          "Deposit Collateral"
        )}
      </button>

      <p className="text-xs text-zinc-500">
        Deposit ETH as collateral to enable borrowing
      </p>
    </div>
  );
}
