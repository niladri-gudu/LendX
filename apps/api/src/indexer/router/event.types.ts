export type RoutedLog = {
  txHash: `0x${string}`;
  logIndex: number;
  blockNumber: number;
  timestamp: number;
  eventName: string;
  args: Record<string, any>;
};
