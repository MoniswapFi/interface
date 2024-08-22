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

export const __CHAIN_IDS__ = {
    bera_testnet: 80084,
};
export const __GRAPH__URLs__ = {
    [__CHAIN_IDS__.bera_testnet]:
        "api.goldsky.com/api/public/project_clws3jv71bgap01u93r59ccbm/subgraphs/moniswap-bartio/pools/gn",
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
export const __WRAPPED_ETHER__ = {
    [__CHAIN_IDS__.bera_testnet]: "0x7507c1dc16935B82698e4C63f2746A2fCf994dF8",
};
export const __IDEAL_GAS__ = BigInt(400000);
