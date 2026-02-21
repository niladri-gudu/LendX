// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IInterestRateModel {
    function getBorrowRate(uint256 utilization) external view returns (uint256);
}