import { useState } from "react";
import { useLendingActions } from "../../hooks/useLendingActions";
import TokenInput from "./TokenInput";

export default function RepayForm() {
  const [amount, setAmount] = useState("");
  const { repay, isBusy } = useLendingActions();

  const handleRepay = async () => {
    if (!amount || Number(amount) <= 0) return;
    const success = await repay(amount);
    if (success) setAmount("");
  };

  return (
    <div className="space-y-4">
      <TokenInput value={amount} setValue={setAmount} symbol="USDC" />

      <button
        onClick={handleRepay}
        disabled={isBusy || !amount}
        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:bg-zinc-700 disabled:opacity-70 disabled:cursor-not-allowed py-3 rounded-xl font-semibold text-white transition-all shadow-lg shadow-blue-900/20"
      >
        {isBusy ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="opacity-90">Processing...</span>
          </>
        ) : (
          "Repay Debt"
        )}
      </button>

      <p className="text-xs text-zinc-500">Approve USDC and repay your debt</p>
    </div>
  );
}
