import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { contracts } from '@repo/contracts';

const client = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_URL),
});

async function main() {
  const debt = await client.readContract({
    address: contracts.LendingPool.address,
    abi: contracts.LendingPool.abi,
    functionName: 'debtUSDC',
    args: ['0x8B3A3cEE208Be2E631950715273ef5bB541ae082'],
  });

  console.log('On-chain debt:', Number(debt) / 1e6, 'USDC');
}

main();
