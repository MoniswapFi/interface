import { rewardsAbi } from "@/assets/abis";
import { useReadContract, useWriteContract } from "wagmi";

export function useRewardsCore() {
    const useRewardsReadables = (rewardContract: string) => {
        const useRewardsListLength = () =>
            useReadContract({
                address: rewardContract as `0x${string}`,
                abi: rewardsAbi,
                functionName: "rewardsListLength",
            });

        const useRewardToken = (position: number) =>
            useReadContract({
                address: rewardContract as `0x${string}`,
                abi: rewardsAbi,
                functionName: "rewards",
                args: [BigInt(position)],
            });

        const useEarned = (token: string, tokenId: number) =>
            useReadContract({
                address: rewardContract as `0x${string}`,
                abi: rewardsAbi,
                functionName: "earned",
                args: [token as `0x${string}`, BigInt(tokenId)],
            });

        return { useRewardsListLength, useRewardToken, useEarned };
    };

    const useRewardsExecutions = (
        rewardContract: string,
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
        const notifyRewardAmount = (token: string, amount: bigint) =>
            writeContract(
                {
                    address: rewardContract as `0x${string}`,
                    abi: rewardsAbi,
                    functionName: "notifyRewardAmount",
                    args: [token as `0x${string}`, amount],
                },
                { onSettled, onError: (error) => console.error(error) },
            );

        return {
            notifyRewardAmount,
            isError,
            isSuccess,
            isPending,
            hash,
            reset,
            error,
        };
    };

    return { useRewardsReadables, useRewardsExecutions };
}
