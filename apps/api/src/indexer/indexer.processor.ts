import { createPublicClient, http, decodeEventLog } from 'viem';
import { sepolia } from 'viem/chains';
import { lendingPoolAddress, lendingPoolAbi } from './constants';

export class IndexerProcessor {
  private client = createPublicClient({
    chain: sepolia,
    transport: http(process.env.RPC_URL),
  });

  async getLatestBlock(): Promise<number> {
    return Number(await this.client.getBlockNumber());
  }

  async getLogs(fromBlock: number, toBlock: number) {
    const logs = await this.client.getLogs({
      address: lendingPoolAddress,
      fromBlock: BigInt(fromBlock),
      toBlock: BigInt(toBlock),
    });

    return logs.map((log) => {
      const decoded = decodeEventLog({
        abi: lendingPoolAbi,
        data: log.data,
        topics: log.topics,
      });

      return {
        ...decoded,
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
        logIndex: log.logIndex,
      };
    });
  }
}
