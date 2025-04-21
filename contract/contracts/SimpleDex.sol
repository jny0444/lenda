// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
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
        routerDeployed = IRouter(_router);
    }

    function addLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB) external {
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        IERC20(tokenA).approve(address(router), amountA);
        IERC20(tokenB).approve(address(router), amountB);

        router.addLiquidity(tokenA, tokenB, amountA, amountB, 1, 1, msg.sender, block.timestamp);
    }

    function addLiquidityWithETH(address token, uint256 tokenAmount) external payable {
        IERC20(token).transferFrom(msg.sender, address(this), tokenAmount);
        IERC20(token).approve(address(router), tokenAmount);

        router.addLiquidityETH{value: msg.value}(token, tokenAmount, 1, 1, msg.sender, block.timestamp);
    }

    function removeLiquidity(address tokenA, address tokenB, uint256 liquidity) external {
        address factory = router.factory();
        address pair = IUniswapV2Factory(factory).getPair(tokenA, tokenB);
        require(pair != address(0), "Pair does not exist");

        IERC20(pair).transferFrom(msg.sender, address(this), liquidity);
        IERC20(pair).approve(address(router), liquidity);

        router.removeLiquidity(tokenA, tokenB, liquidity, 1, 1, msg.sender, block.timestamp);
    }

    function removeLiquidityWithETH(address token, uint256 liquidity) external {
        address factory = router.factory();
        address pair = IUniswapV2Factory(factory).getPair(token, routerDeployed.getWETHAddress());
        require(pair != address(0), "Pair does not exist");

        IERC20(pair).transferFrom(msg.sender, address(this), liquidity);
        IERC20(pair).approve(address(router), liquidity);

        router.removeLiquidityETH(token, liquidity, 1, 1, msg.sender, block.timestamp);
    }

    function swapTokensForTokens(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin) external {
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(router), amountIn);

        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = routerDeployed.getWETHAddress();
        path[2] = tokenOut;

        router.swapExactTokensForTokens(amountIn, amountOutMin, path, msg.sender, block.timestamp);
    }

    function getOutputAmount(address tokenIn, address tokenOut, uint256 amountIn) external view returns (uint256) {
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = routerDeployed.getWETHAddress();
        path[2] = tokenOut;

        uint256[] memory amounts = router.getAmountsOut(amountIn, path);
        return amounts[2];
    }
}
