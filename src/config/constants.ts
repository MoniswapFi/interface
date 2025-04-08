export const PoolTypes = [
  {
    key: "all",
    text: "All Pools",
  },
  {
    key: "stable",
    text: "Stable",
  },
  {
    key: "volatile",
    text: "Volatile",
  },
  {
    key: "concentrated",
    text: "Concentrated",
  },
  {
    key: "incentivized",
    text: "Incentivized",
  },
  {
    key: "low",
    text: "Low TVL",
  },
];

// export const defaultTokens = [
//     {
//         address: "0x5A3740947AdEdADDE6B3034222B779549F0aC42F",
//         chainId: 80084,
//         decimals: 18,
//         logoURI:
//             "https://avatars.githubusercontent.com/u/164018330?s=400&u=e64d7b4d2fec89ee15300ac0c6ca2b003e6a4482&v=4",
//         name: "Moniswap",
//         symbol: "MONI",
//     },
//     {
//         address: "0xd6D83aF58a19Cd14eF3CF6fe848C9A4d21e5727c",
//         chainId: 80084,
//         decimals: 6,
//         logoURI: "https://tokens.pancakeswap.finance/images/symbol/usdc.png",
//         name: "USD Coin",
//         symbol: "USDC",
//     },
// ];

export const __CHAIN_IDS__ = {
  bera_testnet: 80084,
  arbi_mainnet: 42161,
  bera: 80094,
  bera_bepolia: 80069,
};
export const __API_CHAIN_NAMES__ = {
  [__CHAIN_IDS__.bera_testnet]: "bartio",
  [__CHAIN_IDS__.bera]: "berachain",
};
export const __EXPLORERs__ = {
  [__CHAIN_IDS__.bera_testnet]: "https://bartio.beratrail.io",
  [__CHAIN_IDS__.bera]: "https://berascan.com",
  [__CHAIN_IDS__.bera_bepolia]: "https://bepolia.beratrail.io",
};
export const __POOL__GRAPH__URLs__ = {
  [__CHAIN_IDS__.bera_testnet]:
    "api.goldsky.com/api/public/project_clws3jv71bgap01u93r59ccbm/subgraphs/moniswap-bartio-pools/v1.0.0/gn",
  [__CHAIN_IDS__.bera]:
    "api.goldsky.com/api/public/project_cm6w9m5xc0lua011oadkseioi/subgraphs/moniswap-pools/v1.0.0/gn",
};
export const __VOTER__GRAPH__URLs__ = {
  [__CHAIN_IDS__.bera_testnet]:
    "api.goldsky.com/api/public/project_clws3jv71bgap01u93r59ccbm/subgraphs/moniswap-bartio-voter/v1.0.1/gn",
  [__CHAIN_IDS__.bera]:
    "api.goldsky.com/api/public/project_cm6w9m5xc0lua011oadkseioi/subgraphs/moniswap-voter/v1.0.1/gn",
};
export const __ESCROW__GRAPH__URLs__ = {
  [__CHAIN_IDS__.bera_testnet]:
    "api.goldsky.com/api/public/project_clws3jv71bgap01u93r59ccbm/subgraphs/moniswap-bartio-escrow/v1.0.0/gn",
  [__CHAIN_IDS__.bera]:
    "api.goldsky.com/api/public/project_cm6w9m5xc0lua011oadkseioi/subgraphs/moniswap-ve/v1.0.0/gn",
};
export const __ETHER__ = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const __AGGREGATOR_ROUTERS__ = {
  [__CHAIN_IDS__.bera_testnet]: "0xbcC7Eee299c89CBD285A996d461499c7a9af753A",
  [__CHAIN_IDS__.bera]: "0x14Cd5F86b184AD00D237Db8b7F626B8BF6473fF6",
  [__CHAIN_IDS__.bera_bepolia]: "0x79cC64e40CF1b79E54d80fAB5De924efdC1e90d9",
};
export const __PROTOCOL_ROUTERS__ = {
  [__CHAIN_IDS__.bera_testnet]: "0x19042106AABFA3A2cDf46Ea160aA6fa9Db31c261",
  [__CHAIN_IDS__.bera]: "0xf00EB8c6877d18B97C47013AfAc2049584c91bDb",
  [__CHAIN_IDS__.bera_bepolia]: "0x023AF3A2F01982A07c80BDe582E48b4B9b491034",
};
export const __POOL_FACTORIES__ = {
  [__CHAIN_IDS__.bera_testnet]: "0xa933091dd8b94D07cE68DF5eA96822A45e3EA819",
  [__CHAIN_IDS__.bera]: "0xf886ABaCe837E5EC0CF7037B4d2198F7a1bf35B5",
};
export const __VOTER__ = {
  [__CHAIN_IDS__.bera_testnet]: "0x6399081084Aff4A927E8704E77bC939703bd892c",
  [__CHAIN_IDS__.bera]: "0x8160C59218be97F301a857cD8E72e5d3446621df",
  [__CHAIN_IDS__.bera_bepolia]: "0x1515B7652185388925F5D8283496753883416f09",
};
export const __MULTICALL__ = {
  [__CHAIN_IDS__.bera_testnet]: "0x7A723417Ff14DD3CF58917e46614479edFEE5eAD",
  [__CHAIN_IDS__.bera]: "0x5ac443F251826c9e332B225e9a5Dc62453baF88F",
};
export const __VOTING_ESCROW__ = {
  [__CHAIN_IDS__.bera_testnet]: "0xd11163343Ca6a4e5feADdbB979567A7853e6F20a",
  [__CHAIN_IDS__.bera]: "0xB8da258a2B2A8AE31Aab6494D7DC784dC96e5b78",
  [__CHAIN_IDS__.bera_bepolia]: "0x106f65e8ac8Fb84024e583AE1abAf7552E7EE80d",
};
export const __PRICE_ORACLE__ = {
  [__CHAIN_IDS__.bera_testnet]: "0x6D2015Dce2d839c23806278E4DA30500766AC44D",
  [__CHAIN_IDS__.bera]: "0xCA6f864adD2cF45bf2b28FBbC990216Cc759B0Ca",
};
export const __DEDICATED_PRICE_SOURCE__ = {
  [__CHAIN_IDS__.bera_testnet]: "0xd25758eD9D4555ceb2A3c27374aE08Cd470b6Fe3",
  [__CHAIN_IDS__.bera]: "0x34D9a3E8B5Df4DEdB388EB14b7416f76BFFf4E6f",
};
export const __WRAPPED_ETHER__ = {
  [__CHAIN_IDS__.bera_testnet]: "0x7507c1dc16935B82698e4C63f2746A2fCf994dF8",
  [__CHAIN_IDS__.bera]: "0x6969696969696969696969696969696969696969",
  [__CHAIN_IDS__.bera_bepolia]: "0x6969696969696969696969696969696969696969",
};
export const __MONI__ = {
  [__CHAIN_IDS__.bera_testnet]: "0x5A3740947AdEdADDE6B3034222B779549F0aC42F",
  [__CHAIN_IDS__.bera]: "0x64FAF984Bf60dE19e24238521814cA98574E3b00",
  [__CHAIN_IDS__.bera_bepolia]: "0xc361d30b85736f4795a474946C9ca24378373bCF",
};
export const __HONEY__ = {
  [__CHAIN_IDS__.bera_testnet]: "0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03",
  [__CHAIN_IDS__.bera]: "0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce",
};
export const __BERA_PACK__ = {
  [__CHAIN_IDS__.arbi_mainnet]: "0x95a07C40eB0441ef0AD69443fA0766A6392c2861",
};
export const __SMILEE_BERAS__ = {
  [__CHAIN_IDS__.arbi_mainnet]: "0x136798606E85fb4086001AB065e5298fa0c37904",
};
export const __BRUV_BERAS__ = {
  [__CHAIN_IDS__.arbi_mainnet]: "0x26A3C7BFE8C1a6deF5f70006e6a89a9f503fa362",
};
export const __IDEAL_GAS__ = BigInt(400000);

// Helpers
export const __POOL_HELPER__ = {
  [__CHAIN_IDS__.bera_bepolia]: "0x2D67FC1622099Ed068a2049c83773D9016c4aaEf",
};
export const __TRADE_HELPER__ = {
  [__CHAIN_IDS__.bera_bepolia]: "0xEeeC1d828520fC26541624c4e2E34376220CB93a",
};
export const __VE_NFT_HELPER__ = {
  [__CHAIN_IDS__.bera_bepolia]: "0xa45328cB9B5215cc18937AB123fCf44a6815b6C1",
};
export const __EXCHANGE_HELPER__ = {
  [__CHAIN_IDS__.bera_bepolia]: "0xCA6f864adD2cF45bf2b28FBbC990216Cc759B0Ca",
};

export const FAQ_TVL = {
  title: "TVL",
  description:
    "Total volume locked. This is the total value of assets currently staked in the pool. A higher TVL indicates greater liquidity.",
};

export const FAQ_FEES = {
  title: "Fees <24H>",
  description:
    "Accrued fees. These are the fees generated over the past 24 hours from trading activity. The higher the activity, the higher the fees.",
};

export const FAQ_VOLUME = {
  title: "Volume <24H>",
  description:
    "24-hour volume. This represents the total trading volume over the past 24 hours. It reflects how much liquidity has been traded in this period.",
};

export const FAQ_EMISSION_RATE = {
  title: "Emission rate <24H>",
  description:
    "Deposit rate. This indicates the rate of rewards emitted to stakers over the last 24 hours. Higher emission rates typically encourage staking.",
};

export const FAQ_STAKED = {
  title: "Staked",
  description:
    "The total amount of tokens you have currently staked in this pool. Staking allows you to earn rewards based on the pool's emission rate.",
};

export const FAQ_YOUR_DEPOSIT = {
  title: "Your Deposit",
  description:
    "The amount of tokens you have deposited into this pool. Your deposit is what determines your share of the rewards generated in the staking pool.",
};

export const FAQ_APR = {
  title: "APR",
  description:
    "Annual Percentage Rate (APR). This represents the yearly interest rate for staking, accrued daily based on the pool's rewards structure.",
};

export const FAQ_TOTAL_REWARD = {
  title: "Total Reward",
  description:
    "Incentives refer to the total profitable market available in its corresponding token. These rewards are offered to encourage participation in the staking pool or liquidity provision.",
};

export const FAQ_INCENTIVES = {
  title: "Incentives",
  description: "How much incentives were distributed to this pool.",
};
