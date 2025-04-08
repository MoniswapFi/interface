import { Address } from "viem";
import { useWatchBlocks, useWriteContract } from "wagmi";

import { __ETHER__ } from "@/config/constants";
import { useMemo } from "react";
import { erc20Abi, zeroAddress } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";

export function useGetBalance(
  tokenAddress: Address = zeroAddress,
  refetchInterval = 30000,
) {
  const { address = zeroAddress } = useAccount();
  const { data: etherData = { value: BigInt(0) }, isFetching: etherFetching } =
    useBalance({
      address,
      query: {
        enabled:
          tokenAddress === zeroAddress ||
          tokenAddress.toLowerCase() === __ETHER__.toLowerCase(),
        refetchInterval,
      },
    });
  const { data: erc20Balance = BigInt(0), isFetching: erc20Fetching } =
    useReadContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
      query: {
        enabled:
          tokenAddress !== zeroAddress &&
          tokenAddress.toLowerCase() !== __ETHER__.toLowerCase() &&
          address !== zeroAddress,
        refetchInterval,
      },
    });

  // No need to return bothe balances separately. Just return based on token address
  return useMemo(
    () =>
      tokenAddress.toLowerCase() === __ETHER__.toLowerCase() ||
      tokenAddress === zeroAddress
        ? { balance: etherData.value, isLoading: etherFetching }
        : { balance: erc20Balance, isLoading: erc20Fetching },
    [tokenAddress, etherData.value, etherFetching, erc20Balance, erc20Fetching],
  );
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
          console.info("Refetched account balance for %s", tokenAddress),
        )
        .catch(console.debug);
    },
  });

  return {
    balance:
      !!balance && !!decimals ? Number(balance) / Math.pow(10, decimals) : 0,
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
