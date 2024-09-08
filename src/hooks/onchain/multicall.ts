import { multicallAbi } from "@/assets/abis";
import { __MULTICALL__ } from "@/config/constants";
import { useMemo } from "react";
import { useChainId, useWriteContract } from "wagmi";

export function useMulticall() {
    const chainId = useChainId();
    const multicall = useMemo(() => __MULTICALL__[chainId], [chainId]);

    const useRunMulticall = (
        address: string,
        bytes: string[],
        onSettled?: () => any,
    ) => {
        const {
            writeContract,
            isError,
            isSuccess,
            isPending,
            data: hash,
            reset,
            error,
        } = useWriteContract();

        const executeMCall = () =>
            writeContract(
                {
                    abi: multicallAbi,
                    address: multicall as `0x${string}`,
                    functionName: "multicall",
                    args: [address as `0x${string}`, bytes as `0x${string}`[]],
                },
                { onSettled },
            );

        return {
            executeMCall,
            isError,
            isSuccess,
            isPending,
            hash,
            reset,
            error,
        };
    };

    return { useRunMulticall };
}
