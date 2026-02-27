export const addresses = {
  InterestRateModel: "0xe4Aac29336d533B739511c874976bdD12a1F090a",
  MockUSDC: "0xB5b6d7A1134C93DE23FfB968F7d9124534af78bA",
  PriceOracle: "0x2464eC80100E89F065bAd83D15901310Dc3127D2",
  LendingPool: "0x00F6Aa1744DdF7a1EB3CaBEaAFc151b392F6c6ea",
} as const;

import { lendingPoolAbi } from "./abis/lendingPoolAbi";
import { mockUsdcAbi } from "./abis/mockUsdcAbi";
import { priceOracleAbi } from "./abis/priceOracleAbi";
import { interestRateModelAbi } from "./abis/interestRateModelAbi";

export type Address = `0x${string}`;

export const LendingPool = {
  address: addresses.LendingPool as Address,
  abi: lendingPoolAbi,
};

export const MockUSDC = {
  address: addresses.MockUSDC as Address,
  abi: mockUsdcAbi,
};

export const PriceOracle = {
  address: addresses.PriceOracle as Address,
  abi: priceOracleAbi,
};

export const InterestRateModel = {
  address: addresses.InterestRateModel as Address,
  abi: interestRateModelAbi,
};

export const contracts = {
  LendingPool,
  MockUSDC,
  PriceOracle,
  InterestRateModel,
};
