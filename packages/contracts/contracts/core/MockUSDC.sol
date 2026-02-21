// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    address public lendingPool;

    error NotLendingPool();

    constructor() ERC20("Mock USDC Coin", "mUSDC") Ownable(msg.sender) {}

    function setLendingPool(address _pool) external onlyOwner {
        lendingPool = _pool;
    }

    function mint(address to, uint256 amount) external {
        if (msg.sender != lendingPool) revert NotLendingPool();
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        if (msg.sender != lendingPool) revert NotLendingPool();
        _burn(from, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}