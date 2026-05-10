// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OrbitWallet} from "./OrbitWallet.sol";

contract OrbitFactory {
    event OrbitCreated(address indexed owner, address indexed agent, address wallet);

    address[] public wallets;

    function createOrbit(address agent, uint256 perTxCap, uint256 dailyCap, uint256 cooldownSeconds) external payable returns (address wallet) {
        OrbitWallet orbit = new OrbitWallet{value: msg.value}(msg.sender, agent, perTxCap, dailyCap, cooldownSeconds);
        wallet = address(orbit);
        wallets.push(wallet);
        emit OrbitCreated(msg.sender, agent, wallet);
    }

    function walletCount() external view returns (uint256) {
        return wallets.length;
    }
}
