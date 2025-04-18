// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IRouter {
    function getFactoryAddress() external view returns (address);
    function getRouterAddress() external view returns (address);
    function getWETHAddress() external view returns (address);
}

contract SimpleDex {
    IRouter public routerDeployed;
    IUniswapV2Router02 public router;

    constructor(address _router) {
        router = IUniswapV2Router02(_router);
    }

    function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external {
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        IERC20(tokenA).approve(address(router), amountA);
        IERC20(tokenB).approve(address(router), amountB);

        router.addLiquidity(tokenA, tokenB, amountA, amountB, 1, 1, msg.sender, block.timestamp);
    }

    function swapTokensForTokens(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin) external {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(router), amountIn);

        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        router.swapExactTokensForTokens(amountIn, amountOutMin, path, msg.sender, block.timestamp);
    }

    function getOutputAmount(address tokenIn, address tokenOut, uint256 amountIn) external view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;

        uint256[] memory amounts = router.getAmountsOut(amountIn, path);
        return amounts[1];
    }
}
