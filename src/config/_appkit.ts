import { defineChain } from "@reown/appkit/networks";

// Define the custom networks
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

export const berachainBepolia = defineChain({
  id: 80069,
  caipNetworkId: "eip155:80069",
  chainNamespace: "eip155",
  name: "Berachain",
  nativeCurrency: {
    decimals: 18,
    name: "Bera",
    symbol: "BERA",
  },
  rpcUrls: {
    default: {
      http: ["https://bepolia.rpc.berachain.com"],
      webSocket: ["wss://bepolia.rpc.berachain.com"],
    },
  },
  blockExplorers: {
    default: { name: "Berascan", url: "https://bepolia.beratrail.io" },
  },
});
