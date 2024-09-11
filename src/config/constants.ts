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

export const defaultTokens = [
    {
        address: "0x5A3740947AdEdADDE6B3034222B779549F0aC42F",
        chainId: 80084,
        decimals: 18,
        logoURI:
            "https://avatars.githubusercontent.com/u/164018330?s=400&u=e64d7b4d2fec89ee15300ac0c6ca2b003e6a4482&v=4",
        name: "Moniswap",
        symbol: "MONI",
    },
    {
        address: "0xd6D83aF58a19Cd14eF3CF6fe848C9A4d21e5727c",
        chainId: 80084,
        decimals: 6,
        logoURI: "https://tokens.pancakeswap.finance/images/symbol/usdc.png",
        name: "USD Coin",
        symbol: "USDC",
    },
];

export const __CHAIN_IDS__ = {
    bera_testnet: 80084,
    arbi_mainnet: 42161,
};
export const __POOL__GRAPH__URLs__ = {
    [__CHAIN_IDS__.bera_testnet]:
        "api.goldsky.com/api/public/project_clws3jv71bgap01u93r59ccbm/subgraphs/moniswap-bartio-pools/v1.0.0/gn",
};
export const __VOTER__GRAPH__URLs__ = {
    [__CHAIN_IDS__.bera_testnet]:
        "api.goldsky.com/api/public/project_clws3jv71bgap01u93r59ccbm/subgraphs/moniswap-bartio-voter/v1.0.1/gn",
};
export const __ESCROW__GRAPH__URLs__ = {
    [__CHAIN_IDS__.bera_testnet]:
        "api.goldsky.com/api/public/project_clws3jv71bgap01u93r59ccbm/subgraphs/moniswap-bartio-escrow/v1.0.0/gn",
};
export const __ETHER__ = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const __AGGREGATOR_ROUTERS__ = {
    [__CHAIN_IDS__.bera_testnet]: "0xbcC7Eee299c89CBD285A996d461499c7a9af753A",
};
export const __PROTOCOL_ROUTERS__ = {
    [__CHAIN_IDS__.bera_testnet]: "0x19042106AABFA3A2cDf46Ea160aA6fa9Db31c261",
};
export const __POOL_FACTORIES__ = {
    [__CHAIN_IDS__.bera_testnet]: "0xa933091dd8b94D07cE68DF5eA96822A45e3EA819",
};
export const __VOTER__ = {
    [__CHAIN_IDS__.bera_testnet]: "0x6399081084Aff4A927E8704E77bC939703bd892c",
};
export const __MULTICALL__ = {
    [__CHAIN_IDS__.bera_testnet]: "0x7A723417Ff14DD3CF58917e46614479edFEE5eAD",
};
export const __VOTING_ESCROW__ = {
    [__CHAIN_IDS__.bera_testnet]: "0xd11163343Ca6a4e5feADdbB979567A7853e6F20a",
};
export const __WRAPPED_ETHER__ = {
    [__CHAIN_IDS__.bera_testnet]: "0x7507c1dc16935B82698e4C63f2746A2fCf994dF8",
};
export const __MONI__ = {
    [__CHAIN_IDS__.bera_testnet]: "0x5A3740947AdEdADDE6B3034222B779549F0aC42F",
};
export const __BERA_PACK__ = {
    [__CHAIN_IDS__.bera_testnet]: "0x95a07C40eB0441ef0AD69443fA0766A6392c2861",
};
export const __IDEAL_GAS__ = BigInt(400000);
