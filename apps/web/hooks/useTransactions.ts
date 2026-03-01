"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../lib/api";

export const useTransactions = (wallet: string, limit = 5, offset = 0) => {
  return useQuery({
    queryKey: ["transactions", wallet, limit, offset],
    queryFn: () => fetchTransactions(wallet, limit, offset),
    enabled: !!wallet,
    refetchInterval: 30000,
    placeholderData: (previousData) => previousData,
  });
};
