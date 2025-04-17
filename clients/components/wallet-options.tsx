import * as React from "react";
import { useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  // Filter to only show the injected connector (e.g., MetaMask)
  const injectedConnector = connectors.find(
    (connector) => connector.id === "injected"
  );

  return injectedConnector ? (
    <div className="text-black bg-orange-100 hover:text-white font-medium transition-colors duration-200 ease-in-out px-3 py-1.5 border border-orange-100 hover:bg-black rounded-md focus:outline-none focus:ring-1 focus:ring-orange-100 inline-block cursor-pointer">
      <button
        key={injectedConnector.uid}
        onClick={() => connect({ connector: injectedConnector })}
        className="bg-transparent border-none focus:outline-none"
      >
        Connect
      </button>
    </div>
  ) : null;
}
