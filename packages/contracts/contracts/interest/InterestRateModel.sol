// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { IInterestRateModel } from "../interfaces/IInterestRateModel.sol";

contract InterestRateModel is IInterestRateModel {
    error InvalidUtilization();

    uint256 public constant MAX_UTILIZATION = 1e18;

    uint256 public constant LOW_RATE = 5e16;
    uint256 public constant MID_RATE = 1e17;
    uint256 public constant HIGH_RATE = 2e17;

    function getBorrowRate(uint256 utilization) external pure override returns (uint256) {
        if (utilization > MAX_UTILIZATION) revert InvalidUtilization();

        if (utilization <= 5e17) {
            return LOW_RATE;
        }

        if (utilization <= 8e17) {
            return MID_RATE;
        }

        return HIGH_RATE;
    }
}