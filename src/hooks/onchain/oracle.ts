import { oracleABI } from "@/assets/abis";
import { __PRICE_ORACLE__ } from "@/config/constants";
import { treatETHAsWETHIfApplicable } from "@/utils/format";
import { useMemo } from "react";
import { Address, zeroAddress } from "viem";
import { useChainId, useReadContract } from "wagmi";

export const useGetAverageValueInUSD = (
  token: Address,
  value: bigint,
  refetchInterval: number = 10000,
) => {
  const chainId = useChainId();
  const oracle = useMemo(
    () => __PRICE_ORACLE__[chainId] || zeroAddress,
    [chainId],
  );

  return useReadContract({
    abi: oracleABI,
    address: oracle as `0x${string}`,
    functionName: "getAverageValueInUSD",
    args: [treatETHAsWETHIfApplicable(token, chainId), value],
    query: {
      enabled: oracle !== zeroAddress && token !== zeroAddress,
      refetchInterval,
    },
  });
};

export const useGetAverageValueInUSDByPriceSource = (
  source: Address,
  token: Address,
  value: bigint,
  refetchInterval: number = 10000,
) => {
  const chainId = useChainId();
  const oracle = useMemo(
    () => __PRICE_ORACLE__[chainId] || zeroAddress,
    [chainId],
  );

  return useReadContract({
    abi: oracleABI,
    address: oracle as `0x${string}`,
    functionName: "getAverageValueInUSDBySource",
    args: [
      source as `0x${string}`,
      treatETHAsWETHIfApplicable(token, chainId),
      value,
    ],
    query: {
      enabled: oracle !== zeroAddress && token !== zeroAddress,
      refetchInterval,
    },
  });
};
