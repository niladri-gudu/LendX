import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("LendXModule", (m) => {
  const oracle = m.contract("PriceOracle", [2000n * 10n ** 8n]);

  const interest = m.contract("InterestRateModel");

  const usdc = m.contract("MockUSDC");

  const pool = m.contract("LendingPool", [usdc, oracle, interest]);

  m.call(usdc, "setLendingPool", [pool]);

  return { oracle, interest, usdc, pool };
});
