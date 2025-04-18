// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.5.16;

import "@uniswap/v2-core/contracts/UniswapV2Factory.sol";

contract FactoryDeploy {
    address public factoryAddress;

    constructor() public {
        UniswapV2Factory factoryContract = new UniswapV2Factory(msg.sender);
        factoryAddress = address(factoryContract);
    }

    function getFactoryAddress() external view returns (address) {
        return factoryAddress;
    }
}
