// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.6.6;

import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/test/WETH9.sol";

contract RouterDeploy {
    address public routerAddress;
    address public wethAddress;

    constructor(address factoryAddress) public {
        WETH9 wethContract = new WETH9();
        wethAddress = address(wethContract);

        UniswapV2Router02 routerContract = new UniswapV2Router02(factoryAddress, wethAddress);
        routerAddress = address(routerContract);
    }

    function getRouterAddress() external view returns (address) {
        return routerAddress;
    }

    function getWETHAddress() external view returns (address) {
        return wethAddress;
    }
}
