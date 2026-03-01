"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPosition } from "../lib/api";

export const usePosition = (wallet: string) => {
  return useQuery({
    queryKey: ["position", wallet],
    queryFn: () => fetchPosition(wallet),
    enabled: !!wallet,
    refetchInterval: 15000,
  });
};
