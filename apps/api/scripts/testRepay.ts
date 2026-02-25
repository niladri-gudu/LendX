/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import 'dotenv/config';
import {
  createPublicClient,
  createWalletClient,
  formatUnits,
  http,
  parseUnits,
} from 'viem';
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

async function main() {
  const repayAmount = parseUnits('100', 6);

  console.log('Repaying:', formatUnits(repayAmount, 6), 'USDC');

  const balance = (await publicClient.readContract({
    address: contracts.MockUSDC.address,
    abi: contracts.MockUSDC.abi,
    functionName: 'balanceOf',
    args: [account.address],
  })) as bigint;

  console.log('USDC balance:', formatUnits(balance, 6));

  if (balance < repayAmount) {
    throw new Error('❌ Not enough USDC balance');
  }

  const allowance = (await publicClient.readContract({
    address: contracts.MockUSDC.address,
    abi: contracts.MockUSDC.abi,
    functionName: 'allowance',
    args: [account.address, contracts.LendingPool.address],
  })) as bigint;

  console.log('Current allowance:', formatUnits(allowance, 6));

  if (allowance < repayAmount) {
    console.log('Approving USDC...');

    const approveHash = await walletClient.writeContract({
      address: contracts.MockUSDC.address,
      abi: contracts.MockUSDC.abi,
      functionName: 'approve',
      args: [contracts.LendingPool.address, repayAmount],
    });

    console.log('Approve tx:', approveHash);

    await publicClient.waitForTransactionReceipt({ hash: approveHash });
    console.log('✅ Approval confirmed');
  } else {
    console.log('Allowance already sufficient');
  }

  console.log('Repaying loan...');

  const repayHash = await walletClient.writeContract({
    address: contracts.LendingPool.address,
    abi: contracts.LendingPool.abi,
    functionName: 'repay',
    args: [repayAmount],
  });

  console.log('Repay tx:', repayHash);

  await publicClient.waitForTransactionReceipt({ hash: repayHash });
  console.log('✅ Repay confirmed');

  const newDebt = await publicClient.readContract({
    address: contracts.LendingPool.address,
    abi: contracts.LendingPool.abi,
    functionName: 'debtUSDC',
    args: [account.address],
  });

  console.log('New on-chain debt:', formatUnits(newDebt as bigint, 6), 'USDC');
}

main();
