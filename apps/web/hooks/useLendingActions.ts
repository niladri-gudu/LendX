"use client";

import { useWriteContract, useConnection } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { config } from "../lib/wagmi";
import { parseEther } from "viem";
import { toast } from "sonner";
import { LENDING_POOL_ABI } from "../lib/abi/lendingPool";
import { LENDING_POOL_ADDRESS, MOCK_USDC_ADDRESS } from "../lib/contracts";
import { MOCK_USDC_ABI } from "../lib/abi/mockUsdc";
import { waitForTransactionReceipt } from "wagmi/actions";
import { useState } from "react";

export function useLendingActions() {
  const { mutateAsync } = useWriteContract();
  const { address } = useConnection();
  const queryClient = useQueryClient();
  const [isBusy, setIsBusy] = useState(false);

  const refreshAll = (wallet?: string) => {
    queryClient.invalidateQueries({ queryKey: ["stats"] });

    if (wallet) {
      queryClient.invalidateQueries({ queryKey: ["position", wallet] });
      queryClient.invalidateQueries({ queryKey: ["liquidation", wallet] });
      queryClient.invalidateQueries({ queryKey: ["transactions", wallet] });
    }
  };

  const handleError = (e: any, id: string | number) => {
    setIsBusy(false);
    console.error("Transaction Error:", e);
    const isUserRejected =
      e.message?.includes("User rejected") ||
      e.name === "UserRejectedRequestError";

    if (isUserRejected) {
      toast.error("Transaction cancelled in wallet", { id });
    } else {
      toast.error("Transaction failed. Check console for details.", { id });
    }
    return false;
  };

  const deposit = async (ethAmount: string) => {
    const id = toast.loading("Depositing collateral...");
    setIsBusy(true);
    try {
      const hash = await mutateAsync({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: "deposit",
        value: parseEther(ethAmount),
      });
      toast.loading("Waiting for block confirmation...", { id });
      await waitForTransactionReceipt(config, { hash });
      refreshAll(address);
      toast.success("Deposit successful 🎉", { id });
      setIsBusy(false);
      return true;
    } catch (e) {
      return handleError(e, id);
    }
  };

  const borrow = async (amount: string) => {
    const id = toast.loading("Borrowing USDC...");
    setIsBusy(true);
    try {
      const hash = await mutateAsync({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: "borrow",
        args: [BigInt(Math.floor(Number(amount) * 1e6))],
      });
      toast.loading("Transferring USDC to your wallet...", { id });
      await waitForTransactionReceipt(config, { hash });
      refreshAll(address);
      toast.success("Borrow successful 💰", { id });
      setIsBusy(false);
      return true;
    } catch (e) {
      return handleError(e, id);
    }
  };

  const withdraw = async (eth: string) => {
    const id = toast.loading("Withdrawing collateral...");
    setIsBusy(true);
    try {
      const hash = await mutateAsync({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: "withdraw",
        args: [parseEther(eth)],
      });
      toast.loading("Processing withdrawal...", { id });
      await waitForTransactionReceipt(config, { hash });
      refreshAll(address);
      toast.success("Withdraw successful 💸", { id });
      setIsBusy(false);
      return true;
    } catch (e) {
      return handleError(e, id);
    }
  };

  const repay = async (amount: string) => {
    const value = BigInt(Math.floor(Number(amount) * 1e6));
    const id = toast.loading("Step 1/2: Approving USDC...");
    setIsBusy(true);
    try {
      const approveHash = await mutateAsync({
        address: MOCK_USDC_ADDRESS,
        abi: MOCK_USDC_ABI,
        functionName: "approve",
        args: [LENDING_POOL_ADDRESS, value],
      });
      await waitForTransactionReceipt(config, { hash: approveHash });

      toast.loading("Step 2/2: Confirming repayment...", { id });
      const repayHash = await mutateAsync({
        address: LENDING_POOL_ADDRESS,
        abi: LENDING_POOL_ABI,
        functionName: "repay",
        args: [value],
      });
      await waitForTransactionReceipt(config, { hash: repayHash });
      refreshAll(address);
      toast.success("Repayment successful ✅", { id });
      setIsBusy(false);
      return true;
    } catch (e) {
      return handleError(e, id);
    }
  };

  return { deposit, borrow, withdraw, repay, isBusy };
}
