/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { prisma } from '@repo/db';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { IndexerProcessor } from './indexer.processor';
import { EventRouter } from './router/event.router';

@Injectable()
export class IndexerService implements OnModuleInit {
  private publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.RPC_URL),
  });

  private processor = new IndexerProcessor();
  private router = new EventRouter();
  private running = false;

  async onModuleInit() {
    this.start();
  }

  async start() {
    if (this.running) return;
    this.running = true;

    while (true) {
      try {
        await this.syncOnce();
      } catch (error) {
        console.error('Error in indexer loop:', error);
        await this.sleep(5000);
      }
    }
  }

  private async syncOnce() {
    const state = await prisma.indexerState.upsert({
      where: { id: 'main' },
      update: {},
      create: {
        id: 'main',
        lastIndexedBlock: Number(process.env.START_BLOCK || 0),
      },
    });

    const lastBlock = state.lastIndexedBlock;
    const latestBlock = await this.processor.getLatestBlock();

    if (lastBlock >= latestBlock) {
      await this.sleep(1500);
      return;
    }

    const chunk = Number(process.env.INDEXER_CHUNK || 1000);
    const toBlock = Math.min(lastBlock + chunk, latestBlock);

    console.log(`📦 Syncing blocks ${lastBlock + 1} -> ${toBlock}`);

    const logs = await this.processor.getLogs(lastBlock + 1, toBlock);

    logs.sort((a, b) => {
      if (a.blockNumber === b.blockNumber) {
        return a.logIndex - b.logIndex;
      }
      return Number(a.blockNumber - b.blockNumber);
    });

    for (const log of logs) {
      await this.handleLog(log);
    }

    await prisma.indexerState.update({
      where: { id: 'main' },
      data: { lastIndexedBlock: toBlock },
    });
  }

  private async handleLog(log: any) {
    const routed = {
      txHash: log.txHash,
      logIndex: log.logIndex,
      blockNumber: Number(log.blockNumber),
      timestamp: Number(log.blockTimestamp),
      eventName: log.eventName,
      args: log.args,
    };

    await this.router.route(routed);
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async getStatus() {
    const state = await prisma.indexerState.findUnique({
      where: { id: 'main' },
    });

    const lastIndexedBlock = state?.lastIndexedBlock || 0;

    let chainHead = 0;

    try {
      chainHead = Number(await this.publicClient.getBlockNumber());
    } catch (error) {
      console.error('RPC error while fetching block number:', error);
    }

    const lag = Math.max(chainHead - lastIndexedBlock, 0);

    const HEALTHY_LAG_THRESHOLD = 20;

    const isHealthy = lag < HEALTHY_LAG_THRESHOLD;
    const synced = lag === 0;

    return {
      lastIndexedBlock,
      chainHead,
      lag,
      isHealthy,
      synced,
    };
  }
}
