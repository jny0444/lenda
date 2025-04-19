import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi";
import { tokenFactoryConfig } from "./contracts";

export function useTokenFactoryCreateToken() {
  const { writeContract } = useWriteContract();

  async function createToken(name: string, symbol: string) {
    return writeContract({
      ...tokenFactoryConfig,
      functionName: "createToken",
      args: [name, symbol],
    });
  }

  return { createToken };
}