import { http, createConfig, injected } from "wagmi";
import { hardhat } from "wagmi/chains";

export const config = createConfig({
  chains: [hardhat],
  connectors: [injected()],
  transports: {
    [hardhat.id]: http("http://localhost:8545"),
  },
});
