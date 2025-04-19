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
  const [shouldShowMessage, setShouldShowMessage] = useState(false);
  const [createdToken, setCreatedToken] = useState<`0x${string}` | null>(null);

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
      setCreatedToken(tokenAddress);
      setMessage(
        `Token creation successful! Token address: ${tokenAddress}\nYour token has been added to the token list.`
      );
      setShouldShowMessage(true);
      setIsLoading(false);
    },
  });

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isConnected) {
      setMessage("Please connect your wallet first");
      setShouldShowMessage(true);
      return;
    }

    if (!name || !symbol) {
      setMessage("Please enter both token name and symbol");
      setShouldShowMessage(true);
      return;
    }

    try {
      setIsLoading(true);
      setMessage("Creating token, please confirm the transaction...");
      setShouldShowMessage(true);
      await createToken(name, symbol);
      // Loading state cleared when TokenCreated event is received
    } catch (error) {
      console.error("Error creating token:", error);
      setMessage(
        `Error creating token: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setShouldShowMessage(true);
      setIsLoading(false);
    }
  };

  // Reset form and message
  const resetForm = () => {
    setName("");
    setSymbol("");
    setMessage("");
    setShouldShowMessage(false);
    setCreatedToken(null);
  };

  return (
    <div>
      <h1>Launch Your Token</h1>

      {!isConnected && <div>Please connect your wallet to create a token</div>}

      <form onSubmit={handleSubmit}>
        {/* Token Name Input */}
        <div>
          <label htmlFor="name">Token Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Custom Token"
            disabled={isLoading}
          />
        </div>

        {/* Token Symbol Input */}
        <div>
          <label htmlFor="symbol">Token Symbol</label>
          <input
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g. MCT"
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isConnected || isLoading || !name || !symbol}
        >
          {isLoading ? "Creating..." : "Create Token"}
        </button>

        {/* Reset Button */}
        <button type="button" onClick={resetForm} disabled={isLoading}>
          Reset
        </button>
      </form>

      {/* Status Message */}
      {shouldShowMessage && <div className="message">{message}</div>}

      {/* Additional guidance if token was created */}
      {createdToken && (
        <div className="success-info">
          <p>
            Your token has been successfully created and added to the token
            list.
          </p>
          <p>You can view it in the token list section.</p>
        </div>
      )}
    </div>
  );
}
