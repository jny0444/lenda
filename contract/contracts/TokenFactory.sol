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

        tokens.push(address(newToken));
        tokenInfo[address(newToken)] = TokenInfo(name, symbol);

        emit TokenCreated(address(newToken), name, symbol, msg.sender);

        return address(newToken);
    }

    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory) {
        TokenInfo memory info = tokenInfo[tokenAddress];
        return info;
    }

    function getAllTokens() external view returns (address[] memory) {
        return tokens;
    }
}
