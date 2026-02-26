/* eslint-disable @typescript-eslint/no-unsafe-call */
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { contracts } from '@repo/contracts';

const client = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_URL),
});

async function main() {
  const collateral = (await client.readContract({
    address: contracts.LendingPool.address,
    abi: contracts.LendingPool.abi,
    functionName: 'collateralETH',
    args: ['0x8B3A3cEE208Be2E631950715273ef5bB541ae082'],
  })) as bigint;

  console.log(collateral.toString());
}

main();
