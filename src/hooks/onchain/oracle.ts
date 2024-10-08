import { oracleABI } from "@/assets/abis";
import { __PRICE_ORACLE__ } from "@/config/constants";
import { useMemo } from "react";
import { useChainId, useReadContract } from "wagmi";

export const useGetAverageValueInUSD = (token: string, value: bigint) => {
    const chainId = useChainId();
    const oracle = useMemo(() => __PRICE_ORACLE__[chainId], [chainId]);

    return useReadContract({
        abi: oracleABI,
        address: oracle as `0x${string}`,
        functionName: "getAverageValueInUSD",
        args: [token as `0x${string}`, value],
    });
};

export const useGetAverageValueInUSDByPriceSource = (
    source: string,
    token: string,
    value: bigint,
) => {
    const chainId = useChainId();
    const oracle = useMemo(() => __PRICE_ORACLE__[chainId], [chainId]);

    return useReadContract({
        abi: oracleABI,
        address: oracle as `0x${string}`,
        functionName: "getAverageValueInUSDBySource",
        args: [source as `0x${string}`, token as `0x${string}`, value],
    });
};
