import * as React from "react";
import { Connector, useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  // Filter to only show the injected connector (e.g., MetaMask)
  const injectedConnector = connectors.find(
    (connector) => connector.id === "injected"
  );

  return injectedConnector ? (
    <div className="">
      <button
        key={injectedConnector.uid}
        onClick={() => connect({ connector: injectedConnector })}
      >
        {injectedConnector.name}
      </button>
    </div>
  ) : null;
}
