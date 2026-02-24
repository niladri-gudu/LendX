/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma, ActionType } from '@repo/db';
import { IndexedLog } from 'src/types/indexer';

type PersistInput = {
  log: IndexedLog;
  action: ActionType;
  userId?: string;
  amount: string;
};

export async function persistTransaction(input: PersistInput) {
  const { log, action, userId, amount } = input;

  const { txHash, logIndex, blockNumber, timestamp } = log;

  await prisma.transaction.upsert({
    where: {
      txHash_logIndex: {
        txHash,
        logIndex,
      },
    },
    update: {},
    create: {
      txHash,
      logIndex,
      userId,
      action,
      amount,
      blockNumber,
      timestamp: new Date(timestamp * 1000),
    },
  });
}
