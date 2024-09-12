import { erc20Abi } from "@/assets/abis";
import {
    useAccount,
    useBalance,
    useReadContract,
    useWatchBlocks,
    useWriteContract,
} from "wagmi";

export function useNativeBalance() {
    const { address } = useAccount();
    const {
        data: balance,
        refetch,
        isLoading,
        isError,
    } = useBalance({
        address,
    });

    useWatchBlocks({
        onBlock: () => {
            refetch()
                .then(() => console.info("Refetched native balance"))
                .catch(console.debug);
        },
    });

    return {
        balance: !!balance ? Number(balance.value) / Math.pow(10, 18) : 0,
        isLoading,
        isError,
    };
}

export function useERC20Balance(tokenAddress: `0x${string}`) {
    const { address } = useAccount();
    const { data: decimals } = useReadContract({
        abi: erc20Abi,
        functionName: "decimals",
        address: tokenAddress,
    });
    const {
        data: balance,
        refetch,
        isLoading,
        isError,
    } = useReadContract({
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [!address ? "0x" : address],
        address: tokenAddress,
    });

    useWatchBlocks({
        onBlock: () => {
            refetch()
                .then(() =>
                    console.info(
                        "Refetched account balance for %s",
                        tokenAddress,
                    ),
                )
                .catch(console.debug);
        },
    });

    return {
        balance:
            !!balance && !!decimals
                ? Number(balance) / Math.pow(10, decimals)
                : 0,
        isLoading,
        isError,
    };
}

export function useERC20BalanceOfOther(
    tokenAddress: `0x${string}`,
    address: string,
) {
    const { data: decimals } = useReadContract({
        abi: erc20Abi,
        functionName: "decimals",
        address: tokenAddress,
    });
    const {
        data: balance,
        refetch,
        isLoading,
        isError,
    } = useReadContract({
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
        address: tokenAddress,
    });

    useWatchBlocks({
        onBlock: () => {
            refetch()
                .then(() =>
                    console.info(
                        "Refetched account balance for %s",
                        tokenAddress,
                    ),
                )
                .catch(console.debug);
        },
    });

    return {
        balance:
            !!balance && !!decimals
                ? Number(balance) / Math.pow(10, decimals)
                : 0,
        isLoading,
        isError,
    };
}

export function useERC20Allowance(tokenAddress: `0x${string}`) {
    const { address } = useAccount();

    const useAllowance = (acc: `0x${string}`) =>
        useReadContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "allowance",
            args: [address ? address : "0x", acc],
        });

    const useApproval = (acc: `0x${string}`, amount: number) => {
        const {
            writeContract,
            isError,
            isSuccess,
            isPending,
            data: hash,
        } = useWriteContract();

        const executeApproval = () =>
            writeContract({
                abi: erc20Abi,
                account: address,
                address: tokenAddress,
                functionName: "approve",
                args: [acc, BigInt(amount)],
            });

        return { executeApproval, isError, isSuccess, isPending, hash };
    };

    return { useAllowance, useApproval };
}
