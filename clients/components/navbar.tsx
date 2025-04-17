"use client";

import { Account } from "@/components/account";
import { WalletOptions } from "@/components/wallet-options";
import { useAccount } from "wagmi";

export default function Navbar() {
  function ConnectWallet() {
    const { isConnected } = useAccount();
    if (isConnected) return <Account />;
    return <WalletOptions />;
  }

  return (
    <div>
      <ConnectWallet />
    </div>
  );
}
