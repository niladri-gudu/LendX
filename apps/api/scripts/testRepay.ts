import 'dotenv/config';
import { createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { contracts } from '@repo/contracts';

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http(process.env.RPC_URL),
});

async function main() {
  const approveHash = await client.writeContract({
    address: contracts.MockUSDC.address,
    abi: contracts.MockUSDC.abi,
    functionName: 'approve',
    args: [contracts.LendingPool.address, 1_000_000],
  });

  console.log('Approve tx:', approveHash);

  const repayHash = await client.writeContract({
    address: contracts.LendingPool.address,
    abi: contracts.LendingPool.abi,
    functionName: 'repay',
    args: [500_000],
  });

  console.log('Repay tx:', repayHash);
}

main();
