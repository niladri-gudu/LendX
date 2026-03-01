"use client";

import { useState } from "react";
import DepositForm from "./DepositForm";
import RepayForm from "./RepayForm";
import WithdrawForm from "./WithdrawForm";
import BorrowForm from "./BorrowForm";

const tabs = ["deposit", "borrow", "withdraw", "repay"] as const;

export default function ActionPanel() {
  const [active, setActive] = useState<(typeof tabs)[number]>("deposit");

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Actions</h2>

      <div className="flex p-1 bg-black/40 rounded-xl border border-zinc-800 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`flex-1 cursor-pointer py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              active === t
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {active === "deposit" && <DepositForm />}
      {active === "borrow" && <BorrowForm />}
      {active === "withdraw" && <WithdrawForm />}
      {active === "repay" && <RepayForm />}
    </div>
  );
}
