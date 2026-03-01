'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchLiquidation } from '../lib/api';

export const useLiquidation = (wallet?: string) => {
  return useQuery({
    queryKey: ['liquidation', wallet],
    queryFn: () => fetchLiquidation(wallet!),
    enabled: !!wallet,
    refetchInterval: 15000,
  });
};