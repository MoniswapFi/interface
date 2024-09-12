import { voterAbi } from "@/assets/abis";
import { __POOL_FACTORIES__, __VOTER__ } from "@/config/constants";
import { useMemo } from "react";
import { useChainId, useReadContract, useWriteContract } from "wagmi";

export function useVoterCore() {
    const chainId = useChainId();
    const voterAddress = useMemo(() => __VOTER__[chainId], [chainId]);
    const poolFactory = useMemo(() => __POOL_FACTORIES__[chainId], [chainId]);

    const useGetPoolGauge = (poolId: string) =>
        useReadContract({
            abi: voterAbi,
            address: voterAddress as `0x${string}`,
            functionName: "gauges",
            args: [poolId as `0x${string}`],
        });

    const useGetGaugeFees = (gaugeId: string) =>
        useReadContract({
            abi: voterAbi,
            address: voterAddress as `0x${string}`,
            functionName: "gaugeToFees",
            args: [gaugeId as `0x${string}`],
        });

    const useGetGaugeBribe = (gaugeId: string) =>
        useReadContract({
            abi: voterAbi,
            address: voterAddress as `0x${string}`,
            functionName: "gaugeToBribe",
            args: [gaugeId as `0x${string}`],
        });

    const useVotingExecutions = (onSettled?: () => any) => {
        const {
            writeContract,
            isError,
            isSuccess,
            isPending,
            data: hash,
            reset,
            error,
        } = useWriteContract();

        const createGauge = (poolId: string) =>
            writeContract(
                {
                    abi: voterAbi,
                    address: voterAddress as `0x${string}`,
                    functionName: "createGauge",
                    args: [
                        poolFactory as `0x${string}`,
                        poolId as `0x${string}`,
                    ],
                },
                { onSettled },
            );

        const vote = (lockId: number, poolIds: string[], weights: number[]) =>
            writeContract(
                {
                    abi: voterAbi,
                    address: voterAddress as `0x${string}`,
                    functionName: "vote",
                    args: [
                        BigInt(lockId),
                        poolIds as `0x${string}`[],
                        weights.map(BigInt),
                    ],
                },
                { onSettled },
            );

        const resetLock = (lockId: number) =>
            writeContract(
                {
                    abi: voterAbi,
                    address: voterAddress as `0x${string}`,
                    functionName: "reset",
                    args: [BigInt(lockId)],
                },
                { onSettled },
            );

        return {
            createGauge,
            vote,
            resetLock,
            isError,
            isSuccess,
            isPending,
            hash,
            reset,
            error,
        };
    };

    return {
        useGetPoolGauge,
        useGetGaugeFees,
        useGetGaugeBribe,
        useVotingExecutions,
    };
}
