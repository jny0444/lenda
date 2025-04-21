// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import {CustomToken} from "./CustomToken.sol";

contract TokenFactory {
    address[] public tokens;

    struct TokenInfo {
        string name;
        string symbol;
    }

    mapping(address => TokenInfo) public tokenInfo;

    event TokenCreated(address indexed tokenAddress, string name, string symbol, address owner);

    function createToken(string memory name, string memory symbol) external returns (address) {
        CustomToken newToken = new CustomToken(name, symbol);
        newToken.mint(msg.sender, 1000 ether); // Initial mint

        tokens.push(address(newToken));
        tokenInfo[address(newToken)] = TokenInfo(name, symbol);

        emit TokenCreated(address(newToken), name, symbol, msg.sender);
        return address(newToken);
    }

    function faucet(address tokenAddress, uint256 amount) external {
        CustomToken(tokenAddress).faucetMint(amount);
    }

    function getBalanceOfUser(address tokenAddress) external view returns (uint256) {
        return CustomToken(tokenAddress).getBalance();
    }

    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory) {
        return tokenInfo[tokenAddress];
    }

    function getAllTokens() external view returns (address[] memory) {
        return tokens;
    }
}
