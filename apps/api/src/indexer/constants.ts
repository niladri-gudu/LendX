import { parseAbiItem } from 'viem';
import type { Abi } from 'viem';
import { LendingPool } from '@repo/contracts';

export const lendingPoolAddress = LendingPool.address;
export const lendingPoolAbi = LendingPool.abi as Abi;

export const EVENTS = {
  Deposit: parseAbiItem('event Deposit(address indexed user, uint256 amount)'),
  Withdraw: parseAbiItem(
    'event Withdraw(address indexed user, uint256 amount)',
  ),
  Borrow: parseAbiItem('event Borrow(address indexed user, uint256 amount)'),
  Repay: parseAbiItem('event Repay(address indexed user, uint256 amount)'),
  Liquidate: parseAbiItem(
    'event Liquidate(address indexed liquidator, address indexed user, uint256 repayAmount)',
  ),
};
