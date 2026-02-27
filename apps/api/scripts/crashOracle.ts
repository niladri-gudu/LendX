import 'dotenv/config';
import { createWalletClient, http, parseUnits } from 'viem';
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
  const newPrice = parseUnits('20', 8);

  const tx = await client.writeContract({
    address: contracts.PriceOracle.address,
    abi: contracts.PriceOracle.abi,
    functionName: 'setPrice',
    args: [newPrice],
  });

  console.log('Oracle updated tx:', tx);
}

main();
