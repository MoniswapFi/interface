import { escrowAbi } from "@/assets/abis";
import { __VOTING_ESCROW__ } from "@/config/constants";
import { useMemo } from "react";
import { useChainId, useReadContract, useWriteContract } from "wagmi";

export function useEscrowCore() {
    const chainId = useChainId();
    const escrowAddress = useMemo(
        () => __VOTING_ESCROW__[chainId] as `0x${string}`,
        [chainId],
    );

    const useEscrowReadables = () => {
        const useLocked = (tokenId: number) =>
            useReadContract({
                address: escrowAddress,
                abi: escrowAbi,
                functionName: "locked",
                args: [BigInt(tokenId)],
            });

        return { useLocked };
    };
    const useEscrowExecutions = () => {
        const {
            writeContract,
            isError,
            isSuccess,
            isPending,
            data: hash,
            reset,
            error,
        } = useWriteContract();

        const createLock = (value: bigint, lockDuration: number) =>
            writeContract({
                address: escrowAddress,
                abi: escrowAbi,
                functionName: "createLock",
                args: [value, BigInt(lockDuration)],
            });

        const withdraw = (tokenId: number) =>
            writeContract({
                address: escrowAddress,
                abi: escrowAbi,
                functionName: "withdraw",
                args: [BigInt(tokenId)],
            });

        const merge = (token0Id: number, token1Id: number) =>
            writeContract({
                address: escrowAddress,
                abi: escrowAbi,
                functionName: "merge",
                args: [BigInt(token0Id), BigInt(token1Id)],
            });

        const split = (tokenId: number, amount: bigint) =>
            writeContract({
                address: escrowAddress,
                abi: escrowAbi,
                functionName: "split",
                args: [BigInt(tokenId), amount],
            });

        return {
            createLock,
            withdraw,
            merge,
            split,
            isError,
            isSuccess,
            isPending,
            hash,
            reset,
            error,
        };
    };

    return { useEscrowExecutions, useEscrowReadables };
}
