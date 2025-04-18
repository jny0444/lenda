// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@uniswap/v2-core/contracts/UniswapV2Factory.sol";
import "@uniswap/v2-periphery/contracts/UniswapV2Router02.sol";
import "@uniswap/v2-periphery/contracts/test/WETH9.sol";

contract RouterDeploy {
    address public factoryAddress;
    address public routerAddress;
    address public wethAddress;

    constructor() {
        WETH9 wethContract = new WETH9();
        wethAddress = address(wethContract);

        UniswapV2Factory factoryContract = new UniswapV2Factory(msg.sender);
        factoryAddress = address(factoryContract);

        UniswapV2Router02 routerContract = new UniswapV2Router02(factoryAddress, wethAddress);
        routerAddress = address(routerContract);
    }

    function getFactoryAddress() external view returns (address) {
        return factoryAddress;
    }

    function getRouterAddress() external view returns (address) {
        return routerAddress;
    }

    function getWETHAddress() external view returns (address) {
        return wethAddress;
    }
}
