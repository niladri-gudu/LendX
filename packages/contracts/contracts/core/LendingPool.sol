// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { MockUSDC } from "../core/MockUSDC.sol";
import { IPriceOracle } from "../interfaces/IPriceOracle.sol";
import { IInterestRateModel } from "../interfaces/IInterestRateModel.sol";

contract LendingPool is ReentrancyGuard, Ownable {
    error ZeroAmount();
    error NotEnoughCollateral();
    error UnsafePosition();
    error ExceedsBorrowLimit();
    error TransferFailed();

    uint256 public constant LTV = 75e16;         
    uint256 public constant LIQ_THRESHOLD = 80e16;
    uint256 public constant LIQ_BONUS = 5e16;     

    uint256 public constant PRECISION = 1e18;
    uint256 public constant ORACLE_DECIMALS = 1e8;

    MockUSDC public immutable usdc;
    IPriceOracle public immutable oracle;
    IInterestRateModel public immutable interestModel;

    mapping(address => uint256) public collateralETH;
    mapping(address => uint256) public debtUSDC;     

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount);
    event Repay(address indexed user, uint256 amount);
    event Liquidate(address indexed liquidator, address indexed user, uint256 repayAmount);

    constructor(address _usdc, address _oracle, address _interest)
        Ownable(msg.sender)
    {
        usdc = MockUSDC(_usdc);
        oracle = IPriceOracle(_oracle);
        interestModel = IInterestRateModel(_interest);
    }

    function deposit() external payable nonReentrant {
        if (msg.value == 0) revert ZeroAmount();
        collateralETH[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (collateralETH[msg.sender] < amount) revert NotEnoughCollateral();

        collateralETH[msg.sender] -= amount;

        if (_healthFactor(msg.sender) < PRECISION) revert UnsafePosition();

        _safeTransferETH(msg.sender, amount);
        emit Withdraw(msg.sender, amount);
    }

    function borrow(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        uint256 collateralValue = _collateralValueUSD(msg.sender);
        uint256 maxBorrow = (collateralValue * LTV) / PRECISION;

        if (debtUSDC[msg.sender] + amount > maxBorrow) revert ExceedsBorrowLimit();

        debtUSDC[msg.sender] += amount;
        usdc.mint(msg.sender, amount);

        emit Borrow(msg.sender, amount);
    }

    function repay(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        uint256 debt = debtUSDC[msg.sender];
        if (amount > debt) amount = debt;

        usdc.transferFrom(msg.sender, address(this), amount);
        usdc.burn(address(this), amount);

        debtUSDC[msg.sender] -= amount;
        emit Repay(msg.sender, amount);
    }

    function liquidate(address user, uint256 repayAmount) external nonReentrant {
        if (_healthFactor(user) >= PRECISION) revert UnsafePosition();
        if (repayAmount == 0) revert ZeroAmount();

        uint256 userDebt = debtUSDC[user];
        if (repayAmount > userDebt) repayAmount = userDebt;

        usdc.transferFrom(msg.sender, address(this), repayAmount);
        usdc.burn(address(this), repayAmount);

        debtUSDC[user] -= repayAmount;

        uint256 price = oracle.getETHPrice();

        uint256 seizeValue = repayAmount + ((repayAmount * LIQ_BONUS) / PRECISION);

        uint256 ethSeized = (seizeValue * 1e20) / price;

        uint256 available = collateralETH[user];
        if (ethSeized > available) ethSeized = available;

        collateralETH[user] -= ethSeized;

        _safeTransferETH(msg.sender, ethSeized);

        emit Liquidate(msg.sender, user, repayAmount);
    }

    function getAccountData(address user)
        external
        view
        returns (uint256 collateralValue, uint256 debt, uint256 healthFactor)
    {
        collateralValue = _collateralValueUSD(user);
        debt = debtUSDC[user];
        healthFactor = _healthFactor(user);
    }

    function _collateralValueUSD(address user) internal view returns (uint256) {
        uint256 price = oracle.getETHPrice();
        uint256 ethAmount = collateralETH[user];

        uint256 usdValue18 = (ethAmount * price) / ORACLE_DECIMALS;
        return usdValue18 / 1e12;
    }

    function _healthFactor(address user) internal view returns (uint256) {
        uint256 debt = debtUSDC[user];
        if (debt == 0) return type(uint256).max;

        uint256 collateralValue = _collateralValueUSD(user);

        uint256 adjusted = (collateralValue * LIQ_THRESHOLD) / PRECISION;
        return (adjusted * PRECISION) / debt;
    }

    function _safeTransferETH(address to, uint256 amount) internal {
        (bool ok, ) = to.call{value: amount}("");
        if (!ok) revert TransferFailed();
    }
}