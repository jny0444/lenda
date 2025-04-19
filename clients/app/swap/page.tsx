"use client";

import { useState, useEffect, useMemo } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { RiTokenSwapLine } from "react-icons/ri";
import {
  useReadContract,
  useReadContracts,
  useAccount,
  useBalance,
} from "wagmi";
import { tokenFactoryConfig } from "../../utils/contracts";
import { Abi, formatUnits } from "viem";
import { useWatchContractEvent } from "wagmi";

// Define Token interface
interface Token {
  symbol: string;
  name: string;
  balance: string;
  address: string;
}

// Custom hook to get tokens from the blockchain
function useTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get the connected wallet address
  const { address: userAddress } = useAccount();

  // Fetch ETH balance directly using the useBalance hook
  const { data: ethBalanceData } = useBalance({
    address: userAddress,
  });

  // Get all token addresses from TokenFactory contract
  const {
    data: tokenAddresses,
    isLoading: addressesLoading,
    refetch,
  } = useReadContract({
    ...tokenFactoryConfig,
    functionName: "getAllTokens",
    args: [],
  });

  // Watch for TokenCreated events to refresh the list
  useWatchContractEvent({
    ...tokenFactoryConfig,
    eventName: "TokenCreated",
    onLogs() {
      // Refresh the token list when a new token is created
      refetch();
      setRefreshTrigger((prev) => prev + 1);
    },
  });

  // Create token info calls for batch fetching
  const tokenInfoCalls = useMemo(() => {
    if (!tokenAddresses || !Array.isArray(tokenAddresses)) return [];

    return tokenAddresses.map((tokenAddress: string) => ({
      address: tokenFactoryConfig.address,
      abi: tokenFactoryConfig.abi as Abi,
      functionName: "getTokenInfo",
      args: [tokenAddress] as const,
    }));
  }, [tokenAddresses]);

  // Create balance calls for each token
  const balanceCalls = useMemo(() => {
    if (!tokenAddresses || !Array.isArray(tokenAddresses) || !userAddress)
      return [];

    const erc20BalanceAbi = [
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
    ] as const;

    // For each token, create two calls: one for balance and one for decimals
    const calls = [];

    for (const tokenAddress of tokenAddresses) {
      // Add balance call
      calls.push({
        address: tokenAddress as `0x${string}`,
        abi: erc20BalanceAbi,
        functionName: "balanceOf",
        args: [userAddress],
      });

      // Add decimals call
      calls.push({
        address: tokenAddress as `0x${string}`,
        abi: erc20BalanceAbi,
        functionName: "decimals",
        args: [],
      });
    }

    return calls;
  }, [tokenAddresses, userAddress]);

  // Batch fetch token info
  const { data: tokenInfos } = useReadContracts({
    contracts: tokenInfoCalls as Array<{
      address: `0x${string}`;
      abi: Abi;
      functionName: string;
      args: readonly [string];
    }>,
  });

  // Batch fetch token balances and decimals
  const { data: tokenBalancesData } = useReadContracts({
    contracts: balanceCalls,
  });

  // Process the token data
  useEffect(() => {
    if (!tokenAddresses && !ethBalanceData) {
      return;
    }

    const processedTokens: Token[] = [];

    if (Array.isArray(tokenAddresses)) {
      tokenAddresses.forEach((address: string, index: number) => {
        const info = tokenInfos?.[index]?.result as {
          name: string;
          symbol: string;
        };
        let balance = "0.00";

        // If we have balance data, format it properly
        if (tokenBalancesData && userAddress) {
          const balanceIndex = index * 2; // Each token has 2 calls (balance, decimals)
          const decimalsIndex = index * 2 + 1;

          const rawBalance = tokenBalancesData[balanceIndex]?.result;
          const decimals = tokenBalancesData[decimalsIndex]?.result;

          if (rawBalance && decimals) {
            // Format the balance with proper decimal places
            balance = formatUnits(
              rawBalance as unknown as bigint,
              Number(decimals)
            ).toString();

            // Limit to max 4 decimal places for display
            const parts = balance.split(".");
            if (parts.length > 1 && parts[1].length > 4) {
              balance = `${parts[0]}.${parts[1].substring(0, 4)}`;
            }
          }
        }

        processedTokens.push({
          address: address,
          name: info?.name || "Unknown Token",
          symbol: info?.symbol || "???",
          balance,
        });
      });
    }

    // Get ETH balance using the useBalance hook
    let ethBalance = "0.00";
    if (ethBalanceData) {
      // Format ETH balance to show only 4 decimal places
      const parts = ethBalanceData.formatted.split(".");
      if (parts.length > 1 && parts[1].length > 4) {
        ethBalance = `${parts[0]}.${parts[1].substring(0, 4)}`;
      } else {
        ethBalance = ethBalanceData.formatted;
      }
    }

    const allTokens = [
      {
        address: "0x0000000000000000000000000000000000000000",
        name: "Ethereum",
        symbol: "ETH",
        balance: ethBalance,
      },
      ...processedTokens,
    ];

    setTokens(allTokens);
    setIsLoading(false);
  }, [
    tokenAddresses,
    tokenInfos,
    tokenBalancesData,
    addressesLoading,
    ethBalanceData,
    refreshTrigger,
    userAddress,
  ]);

  return { tokens, isLoading };
}

// Mock tokens as fallback
const mockTokens = [
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "0",
    address: "0x0000000000000000000000000000000000000000",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "0",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  {
    symbol: "USDT",
    name: "Tether",
    balance: "0",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  {
    symbol: "DAI",
    name: "Dai",
    balance: "0",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
];

export default function Swap() {
  // Use our custom hook to fetch tokens from the blockchain
  const { tokens, isLoading } = useTokens();

  // Fallback to mock tokens if loading or no tokens found
  const availableTokens =
    isLoading || !tokens || tokens.length === 0 ? mockTokens : tokens;

  const [inputToken, setInputToken] = useState(availableTokens[0]);
  const [outputToken, setOutputToken] = useState(availableTokens[1]);
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [isSelectingToken, setIsSelectingToken] = useState<
    "from" | "to" | null
  >(null);

  // Update tokens when they load from the blockchain
  useEffect(() => {
    if (!isLoading && tokens && tokens.length >= 2) {
      setInputToken(tokens[0]);
      setOutputToken(tokens[1]);
    }
  }, [isLoading, tokens]);

  // Mock function to simulate price calculation
  const calculateOutputAmount = (input: string) => {
    if (!input || isNaN(parseFloat(input))) return "";
    // Mock exchange rate: 1 ETH = 1800 USDC
    const rate =
      inputToken.symbol === "ETH" && outputToken.symbol === "USDC"
        ? 1800
        : inputToken.symbol === "USDC" && outputToken.symbol === "ETH"
        ? 1 / 1800
        : 1; // Default 1:1 for other pairs

    return (parseFloat(input) * rate).toFixed(6);
  };

  const handleInputChange = (value: string) => {
    setInputAmount(value);
    setOutputAmount(calculateOutputAmount(value));
  };

  const handleTokenSelect = (token: Token) => {
    if (isSelectingToken === "from") {
      // Don't allow selecting the same token
      if (token.symbol === outputToken.symbol) {
        // Swap the tokens
        setInputToken(outputToken);
        setOutputToken(inputToken);
      } else {
        setInputToken(token);
      }
    } else {
      // Don't allow selecting the same token
      if (token.symbol === inputToken.symbol) {
        // Swap the tokens
        setInputToken(outputToken);
        setOutputToken(inputToken);
      } else {
        setOutputToken(token);
      }
    }
    setIsSelectingToken(null);
    // Recalculate the output amount based on the new token pair
    setOutputAmount(calculateOutputAmount(inputAmount));
  };

  const handleSwapTokens = () => {
    const tempToken = inputToken;
    setInputToken(outputToken);
    setOutputToken(tempToken);

    // Swap amounts and recalculate
    if (inputAmount) {
      setInputAmount(outputAmount);
      setOutputAmount(inputAmount);
    }
  };

  const handleSwapSubmit = () => {
    alert(
      `Swap ${inputAmount} ${inputToken.symbol} for ${outputAmount} ${outputToken.symbol}`
    );
    // In a real application, this would call a contract method to execute the swap
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] relative">
      {/* Grid Background with gradient mask */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-24 grid-rows-24 opacity-15 pointer-events-none">
          {Array(576)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border border-orange-50"></div>
            ))}
        </div>
        {/* Gradient mask overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black pointer-events-none"></div>
      </div>
      <div className="bg-black rounded-xl shadow-lg p-4 w-full max-w-md border border-orange-50 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-white">Swap</h2>
        </div>

        {/* Token selection modal */}
        {isSelectingToken && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-black rounded-xl w-full max-w-md p-4 border border-orange-50 shadow-orange-50 relative">
              {/* Grid Background */}
              <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
                {Array(144)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="border border-gray-500"></div>
                  ))}
              </div>
              <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="text-lg text-white">Select a token</h3>
                <button
                  onClick={() => setIsSelectingToken(null)}
                  className="text-white hover:text-orange-50"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 relative z-10">
                {isLoading ? (
                  <div className="text-center py-4">Loading tokens...</div>
                ) : (
                  availableTokens.map((token) => (
                    <div
                      key={token.symbol + token.address}
                      onClick={() => handleTokenSelect(token)}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-900 cursor-pointer"
                    >
                      <div className="w-8 h-8 text-2xl rounded-full flex items-center justify-center mr-2">
                        🪙
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {token.symbol}
                        </div>
                        <div className="text-sm text-gray-400">
                          {token.name}
                        </div>
                      </div>
                      <div className="ml-auto text-gray-400">
                        {token.balance}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Input (From) section */}
        <div className="bg-orange-50 rounded-xl p-4 mb-1">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-black">From</span>
            <span className="text-sm text-black">
              Balance: {inputToken.balance} {inputToken.symbol}
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={inputAmount}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="0.0"
              className="bg-transparent text-2xl text-black flex-grow outline-none"
            />
            <button
              onClick={() => setIsSelectingToken("from")}
              className="flex items-center bg-black rounded-full py-1 px-2 md:-ml-8 -ml-96"
            >
              <div className="w-6 h-6 bg-black text-black rounded-full flex items-center justify-center mr-2">
                🪙
              </div>
              <span className="text-orange-50 font-medium mr-1">
                {inputToken.symbol}
              </span>
              <span>
                <FiArrowUpRight />
              </span>
            </button>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center -my-4 relative z-10">
          <button
            onClick={handleSwapTokens}
            className="bg-black text-2xl border border-gray-800 rounded-full px-1.5 w-10 h-10 hover:border-orange-50"
          >
            <RiTokenSwapLine />
          </button>
        </div>

        {/* Output (To) section */}
        <div className="bg-orange-50 rounded-xl p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-black">To (estimated)</span>
            <span className="text-sm text-black">
              Balance: {outputToken.balance} {outputToken.symbol}
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={outputAmount}
              readOnly
              placeholder="0.0"
              className="bg-transparent text-2xl text-black flex-grow outline-none"
            />
            <button
              onClick={() => setIsSelectingToken("to")}
              className="flex items-center bg-black rounded-full py-1 px-2 md:-ml-8 -ml-96"
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2">
                🪙
              </div>
              <span className="text-white font-medium mr-1">
                {outputToken.symbol}
              </span>
              <span>
                <FiArrowUpRight />
              </span>
            </button>
          </div>
        </div>

        {/* Swap button */}
        <button
          onClick={handleSwapSubmit}
          disabled={
            !inputAmount || !outputAmount || parseFloat(inputAmount) <= 0
          }
          className={`w-full rounded-xl py-3 font-medium text-lg ${
            !inputAmount || !outputAmount || parseFloat(inputAmount) <= 0
              ? "bg-black text-orange-50 border border-dashed border-orange-50 cursor-not-allowed"
              : "bg-orange-50 hover:bg-orange-100 text-black"
          }`}
        >
          {!inputAmount || parseFloat(inputAmount) <= 0
            ? "Enter an amount"
            : "Swap"}
        </button>
      </div>
    </div>
  );
}
