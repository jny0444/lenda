import { useReadContract } from "wagmi";
import {
  customTokenConfig,
  factoryDeployConfig,
  routerDeployConfig,
  simpleDexConfig,
  tokenFactoryConfig,
} from "./contracts";

export function useTokenFactoryGetAllTokens() {
  const { data, isLoading, error } = useReadContract({
    ...tokenFactoryConfig,
    functionName: "getAllTokens",
    args: [],
  });

  const tokens = data as `0x${string}`[] | undefined;

  return { tokens, isLoading, error };
}
