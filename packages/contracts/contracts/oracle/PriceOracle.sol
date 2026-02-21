// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IPriceOracle } from "../interfaces/IPriceOracle.sol";

contract PriceOracle is IPriceOracle, Ownable {
    uint256 private ethPrice;

    event PriceUpdated(uint256 oldPrice, uint256 newPrice, uint256 timestamp);

    error InvalidPrice();

    constructor(uint256 _initialPrice) Ownable(msg.sender) {
        if (_initialPrice == 0) revert InvalidPrice();
        ethPrice = _initialPrice;
    }

    function setPrice(uint256 _newPrice) external onlyOwner {
        if (_newPrice == 0) revert InvalidPrice();

        uint256 old = ethPrice;
        ethPrice = _newPrice;

        emit PriceUpdated(old, _newPrice, block.timestamp);
    }

    function getETHPrice() external view override returns (uint256) {
        return ethPrice;
    }
}