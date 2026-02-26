import 'dotenv/config';
import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  formatEther,
} from 'viem';
import { sepolia } from 'viem/chains';
import { contracts } from '@repo/contracts';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_URL),
});

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(process.env.RPC_URL),
});

async function main() {
  console.log('Withdrawing from LendingPool...');
  console.log('Wallet: ', account.address);

  const collateral = (await publicClient.readContract({
    address: contracts.LendingPool.address,
    abi: contracts.LendingPool.abi,
    functionName: 'collateralETH',
    args: [account.address],
  })) as bigint;

  console.log('Current collateral:', formatEther(collateral), 'ETH');

  if (collateral === 0n) {
    throw new Error('No collateral to withdraw');
  }

  const withdrawAmount = parseEther('0.01');

  console.log('Attempting to withdraw:', formatEther(withdrawAmount), 'ETH');

  if (withdrawAmount > collateral) {
    throw new Error('Withdraw amount > collateral');
  }

  const txHash = await walletClient.writeContract({
    address: contracts.LendingPool.address,
    abi: contracts.LendingPool.abi,
    functionName: 'withdraw',
    args: [withdrawAmount],
  });

  console.log('Withdraw tx:', txHash);

  await publicClient.waitForTransactionReceipt({ hash: txHash });

  console.log('✅ Withdraw confirmed');

  const remaining = (await publicClient.readContract({
    address: contracts.LendingPool.address,
    abi: contracts.LendingPool.abi,
    functionName: 'collateralETH',
    args: [account.address],
  })) as bigint;

  console.log('Remaining collateral:', formatEther(remaining), 'ETH');
}

main().catch((err) => {
  console.error('❌ Withdraw failed');
  console.error(err);
});
