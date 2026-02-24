export const addresses = {
  LendingPool: "0xFD21de4B27ccbE0A17c0e2E2e923A2E7902Bbe86",
  MockUSDC: "0xCDeEa7E3896D38b35eEc261b2B9D1555Ff0802e0",
  PriceOracle: "0xb267e7B3EC8aF73e3ED247473A5e579202dd8cC2",
  InterestRateModel: "0x22637C60Ac0F7bD24423bd0681ADFA5D03322157",
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
