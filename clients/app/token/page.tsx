"use client";

import TokenLaunch from "@/components/tokenLaunch";
import { TokenFactoryGetAllTokens } from "@/utils/useContractRead";

export default function TokenPage() {
  return (
    <div>
      <TokenLaunch />
      <TokenFactoryGetAllTokens />
    </div>
  );
}
