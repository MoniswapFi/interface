import { __VOTER__, __VOTER__GRAPH__URLs__ } from "@/config/constants";
import {
    execute,
    IndexVotePositionDocument,
    IndexVoterDocument,
    type VotePosition,
    type Voter,
} from "@/graphclient";
import { useMemo } from "react";
import { createQuery } from "react-query-kit";
import { useAccount, useChainId } from "wagmi";

export function useVoterInfo() {
    const chainId = useChainId();
    const id = useMemo(() => __VOTER__[chainId], [chainId]);
    const url = useMemo(() => __VOTER__GRAPH__URLs__[chainId], [chainId]);

    return useMemo(
        () =>
            createQuery({
                queryKey: [`${Date.now()}=${Math.random() * 7000}=voterInfo`],
                fetcher: async (): Promise<Voter> => {
                    const { data } = await execute(
                        IndexVoterDocument,
                        { id },
                        { url },
                    );
                    return data.voter;
                },
            }),
        [id, url],
    );
}

export function useVotePositions() {
    const chainId = useChainId();
    const { address } = useAccount();
    const url = useMemo(() => __VOTER__GRAPH__URLs__[chainId], [chainId]);

    return useMemo(
        () =>
            createQuery({
                queryKey: [
                    `${Date.now()}=${Math.random() * 7000}=votePositions`,
                ],
                fetcher: async (): Promise<VotePosition[]> => {
                    const { data } = await execute(
                        IndexVotePositionDocument,
                        { account: address },
                        { url },
                    );
                    return data.votePositions;
                },
            }),
        [url, address],
    );
}
