import { wethABI } from "@/assets/abis";
import { __WRAPPED_ETHER__ } from "@/config/constants";
import { useMemo } from "react";
import { parseEther } from "viem";
import { useChainId, useWriteContract } from "wagmi";

export function useWETH_ETHProcesses(amount: number, onSettled?: () => any) {
  const chainId = useChainId();
  const weth = useMemo(() => __WRAPPED_ETHER__[chainId], [chainId]);

  const {
    writeContract,
    isError,
    isSuccess,
    isPending,
    data: hash,
    reset,
    error,
  } = useWriteContract();

  const executeDeposit = () =>
    writeContract(
      {
        abi: wethABI,
        address: weth as `0x${string}`,
        functionName: "deposit",
        value: parseEther(amount.toString()),
      },
      { onSettled },
    );

  const executeWithdrawal = () =>
    writeContract(
      {
        abi: wethABI,
        address: weth as `0x${string}`,
        functionName: "withdraw",
        args: [parseEther(amount.toString())],
      },
      { onSettled },
    );

  return {
    executeWithdrawal,
    executeDeposit,
    isError,
    isSuccess,
    isPending,
    hash,
    reset,
    error,
  };
}
