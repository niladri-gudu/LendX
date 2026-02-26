/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createPublicClient, formatUnits, http } from 'viem';
import { sepolia } from 'viem/chains';
import { contracts } from '@repo/contracts';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_URL),
});

async function main() {
  const oracleFromPool = await publicClient.readContract({
    address: contracts.LendingPool.address,
    abi: contracts.LendingPool.abi,
    functionName: 'oracle',
  });

  console.log('Pool oracle:', oracleFromPool);
  console.log('Frontend oracle:', contracts.PriceOracle.address);
}

main();
