import { defineChain } from "@reown/appkit/networks";

// Define the custom network
export const berachain = defineChain({
  id: 80094,
  caipNetworkId: "eip155:80094",
  chainNamespace: "eip155",
  name: "Berachain",
  nativeCurrency: {
    decimals: 18,
    name: "Bera",
    symbol: "BERA",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.berachain.com"],
      webSocket: ["wss://rpc.berachain.com"],
    },
  },
  blockExplorers: {
    default: { name: "Berascan", url: "https://berascan.com" },
  },
});
