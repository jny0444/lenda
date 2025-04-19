"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { tokenFactoryConfig } from "./contracts";
import { useMemo, useState, useEffect } from "react";
import { Abi } from "viem";
import { useWatchContractEvent } from "wagmi";

// Define a type for the token information returned from the contract
type TokenInfo = {
  name: string;
  symbol: string;
};

export function TokenFactoryGetAllTokens() {
  // Add a refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    data: tokens,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    ...tokenFactoryConfig,
    functionName: "getAllTokens",
    args: [],
  });

  // Watch for TokenCreated events
  useWatchContractEvent({
    ...tokenFactoryConfig,
    eventName: "TokenCreated",
    onLogs() {
      // Refresh the token list when a new token is created
      refetch();
      setRefreshTrigger((prev) => prev + 1); // Trigger a refresh
    },
  });

  const tokenInfoCalls = useMemo(() => {
    if (!tokens || !Array.isArray(tokens)) return [];
    return tokens.map((token) => ({
      address: tokenFactoryConfig.address,
      abi: tokenFactoryConfig.abi as Abi,
      functionName: "getTokenInfo", // Use the correct getTokenInfo function
      args: [token] as const,
    }));
  }, [tokens]);

  const {
    data: tokenInfos,
    isLoading: infoLoading,
    error: infoError,
  } = useReadContracts({
    contracts: tokenInfoCalls as any[], // Type assertion to avoid complex typing issues
  });

  if (isLoading || infoLoading) return <p>Loading...</p>;
  if (error || infoError) return <p>Error loading token info</p>;

  if (!tokens || !Array.isArray(tokens) || tokens.length === 0)
    return <div>No tokens found</div>;

  return (
    <div>
      <ul>
        {tokens.map((token, i) => {
          // The tokenInfo function returns an object with name and symbol properties
          const info = tokenInfos?.[i]?.result as unknown as TokenInfo;
          const name = info?.name || "";
          const symbol = info?.symbol || "";

          return (
            <li key={token}>
              {name} ({symbol}) <span>{`${token.slice(0, 4)}...${token.slice(-4)}`}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
