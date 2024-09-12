import { gaugeAbi } from "@/assets/abis";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

export function useGaugeCore() {
    const { address } = useAccount();

    const useGaugeReadables = (gaugeId: string) => {
        const useRewardRate = () =>
            useReadContract({
                address: gaugeId as `0x${string}`,
                abi: gaugeAbi,
                functionName: "rewardRate",
            });

        const useEarned = () =>
            useReadContract({
                address: gaugeId as `0x${string}`,
                abi: gaugeAbi,
                functionName: "earned",
                args: [address as `0x${string}`],
            });

        const useBalanceOf = () =>
            useReadContract({
                address: gaugeId as `0x${string}`,
                abi: gaugeAbi,
                functionName: "balanceOf",
                args: [address as `0x${string}`],
            });

        return {
            useRewardRate,
            useEarned,
            useBalanceOf,
        };
    };

    const useGaugeExecutions = (gaugeId: string, onSettled?: () => any) => {
        const {
            writeContract,
            isError,
            isSuccess,
            isPending,
            data: hash,
            reset,
            error,
        } = useWriteContract();

        const deposit = (amount: bigint) =>
            writeContract(
                {
                    address: gaugeId as `0x${string}`,
                    abi: gaugeAbi,
                    functionName: "deposit",
                    args: [amount],
                },
                { onSettled },
            );

        const getReward = () =>
            writeContract(
                {
                    address: gaugeId as `0x${string}`,
                    abi: gaugeAbi,
                    functionName: "getReward",
                    args: [address as `0x${string}`],
                },
                { onSettled },
            );

        const withdraw = (amount: bigint) =>
            writeContract(
                {
                    address: gaugeId as `0x${string}`,
                    abi: gaugeAbi,
                    functionName: "withdraw",
                    args: [amount],
                },
                { onSettled },
            );

        return {
            deposit,
            withdraw,
            getReward,
            isError,
            isSuccess,
            isPending,
            hash,
            reset,
            error,
        };
    };

    return { useGaugeExecutions, useGaugeReadables };
}
