import type { Abi } from "viem"

import LendiingPoolAbi from "./abis/LendingPool.json";
import MockUSDCAbi from "./abis/MockUSDC.json";
import PriceOracleAbi from "./abis/PriceOracle.json";
import InterestRateModelAbi from "./abis/InterestRateModel.json";

import { addresses } from "./addresses.js";

export type Address = `0x${string}`;

export const LendingPool = {
  address: addresses.LendingPool as Address,
  abi: LendiingPoolAbi.abi as Abi,
};

export const MockUSDC = {
  address: addresses.MockUSDC as Address,
  abi: MockUSDCAbi.abi as Abi,
};

export const PriceOracle = {
  address: addresses.PriceOracle as Address,
  abi: PriceOracleAbi.abi as Abi,
};

export const InterestRateModel = {
  address: addresses.InterestRateModel as Address,
  abi: InterestRateModelAbi.abi as Abi,
};

export const contracts = {
  LendingPool,
  MockUSDC,
  PriceOracle,
  InterestRateModel,
};
