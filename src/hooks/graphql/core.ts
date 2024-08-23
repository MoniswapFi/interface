import { __GRAPH__URLs__, __POOL_FACTORIES__ } from "@/config/constants";
import {
    execute,
    IndexAccountPositionsDocument,
    IndexAllPoolsDocument,
    IndexFeesDocument,
    IndexPoolFactoryInfoDocument,
    IndexSinglePairDocument,
    type AccountPosition,
    type Fee,
    type Pair,
    type PoolFactory,
} from "@/graphclient";
import { useMemo } from "react";
import { createQuery } from "react-query-kit";
import { useAccount, useChainId } from "wagmi";

export function useFactoryInfo() {
    const chainId = useChainId();
    const id = useMemo(() => __POOL_FACTORIES__[chainId], [chainId]);
    const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);
    return useMemo(
        () =>
            createQuery({
                queryKey: [`${Date.now()}=${Math.random() * 7000}=factoryInfo`],
                fetcher: async (): Promise<PoolFactory> => {
                    const { data } = await execute(
                        IndexPoolFactoryInfoDocument,
                        { id },
                        { url },
                    );
                    return data.poolFactory;
                },
            }),
        [id, url],
    );
}

export function useSinglePoolInfo(poolId?: string) {
    const chainId = useChainId();
    const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);
    return useMemo(
        () =>
            createQuery({
                queryKey: [
                    `${Date.now()}=${Math.random() * 7000}=singlePoolInfo`,
                ],
                fetcher: async (): Promise<Pair> => {
                    const { data } = await execute(
                        IndexSinglePairDocument,
                        { id: poolId },
                        { url },
                    );
                    return data.pair;
                },
            }),
        [poolId, url],
    );
}

export function useAllPools(first: number = 1000) {
    const chainId = useChainId();
    const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);

    return useMemo(
        () =>
            createQuery({
                queryKey: [`${Date.now()}=${Math.random() * 7000}=allPools`],
                fetcher: async (): Promise<Pair[]> => {
                    const { data } = await execute(
                        IndexAllPoolsDocument,
                        { first },
                        { url },
                    );
                    return data.pairs || [];
                },
            }),
        [first, url],
    );
}

export function usePoolPositions() {
    const { address } = useAccount();
    const chainId = useChainId();
    const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);

    return useMemo(
        () =>
            createQuery({
                queryKey: [
                    `${Date.now()}=${Math.random() * 7000}=poolPositions`,
                ],
                fetcher: async (): Promise<AccountPosition[]> => {
                    const { data } = await execute(
                        IndexAccountPositionsDocument,
                        { account: address },
                        { url },
                    );
                    return data.accountPositions || [];
                },
            }),
        [address, url],
    );
}

export function usePoolRewards() {
    const { address } = useAccount();
    const chainId = useChainId();
    const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);

    return useMemo(
        () =>
            createQuery({
                queryKey: [`${Date.now()}=${Math.random() * 7000}=poolRewards`],
                fetcher: async (): Promise<Fee[]> => {
                    if (address) {
                        const { data } = await execute(
                            IndexFeesDocument,
                            {},
                            { url },
                        );
                        return data.fees || [];
                    } else return [];
                },
            }),
        [address, url],
    );
}
