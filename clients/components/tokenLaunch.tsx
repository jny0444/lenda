"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useTokenFactoryCreateToken } from "@/utils/useContractWrite";
import { useWatchContractEvent } from "wagmi";
import { tokenFactoryConfig } from "@/utils/contracts";

// Define the type for TokenCreated event arguments
type TokenCreatedEvent = {
  tokenAddress: `0x${string}`;
  name: string;
  symbol: string;
  owner: `0x${string}`;
};

export default function TokenLaunch() {
  // Form state
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Contract hooks
  const { createToken } = useTokenFactoryCreateToken();
  const { isConnected } = useAccount();

  // Watch for token created events
  useWatchContractEvent({
    ...tokenFactoryConfig,
    eventName: "TokenCreated",
    onLogs(logs) {
      // Type cast the log to access args with the expected structure
      const log = logs[0] as unknown as { args: TokenCreatedEvent };
      const tokenAddress = log.args?.tokenAddress || "Check your wallet";
      setMessage(`Token creation successful! Token address: ${tokenAddress}`);
      setIsLoading(false);
    },
  });

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isConnected) {
      setMessage("Please connect your wallet first");
      return;
    }

    if (!name || !symbol) {
      setMessage("Please enter both token name and symbol");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("Creating token, please confirm the transaction...");
      await createToken(name, symbol);
    } catch (error) {
      console.error("Error creating token:", error);
      setMessage(
        `Error creating token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Launch Your Token</h1>

      {!isConnected && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4">
          Please connect your wallet to create a token
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Token Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Token Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Ethereum"
            className="w-full p-2 mt-1 border rounded"
            disabled={!isConnected || isLoading}
          />
        </div>

        {/* Token Symbol Input */}
        <div>
          <label
            htmlFor="symbol"
            className="block text-sm font-medium text-gray-700"
          >
            Token Symbol
          </label>
          <input
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g., ETH"
            className="w-full p-2 mt-1 border rounded"
            disabled={!isConnected || isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isConnected || isLoading}
          className="w-full p-2 text-white bg-indigo-600 rounded disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Launch Token"}
        </button>
      </form>

      {/* Status Messages */}
      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.includes("Error")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
