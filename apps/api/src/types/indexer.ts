export type IndexedLog = {
  txHash: `0x${string}`;
  logIndex: number;
  blockNumber: number;
  timestamp: number;
  eventName: string;
  args: any;
};
