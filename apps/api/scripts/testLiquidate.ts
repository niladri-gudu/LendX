import 'dotenv/config';
import { createWalletClient, createPublicClient, http, parseUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { contracts } from '@repo/contracts';

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

const BORROWER = account.address;

async function main() {
  const repayAmount = parseUnits('200', 6);

  console.log('Liquidating borrower:', BORROWER);

  const approve = await walletClient.writeContract({
    address: contracts.MockUSDC.address,
    abi: contracts.MockUSDC.abi,
    functionName: 'approve',
    args: [contracts.LendingPool.address, repayAmount],
  });

  await publicClient.waitForTransactionReceipt({ hash: approve });

  console.log('Approved USDC');

  const tx = await walletClient.writeContract({
    address: contracts.LendingPool.address,
    abi: contracts.LendingPool.abi,
    functionName: 'liquidate',
    args: [BORROWER, repayAmount],
  });

  console.log('Liquidation tx:', tx);

  await publicClient.waitForTransactionReceipt({ hash: tx });

  console.log('✅ Liquidation executed');
}

main();
