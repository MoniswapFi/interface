import {
  exchangeHelperABI,
  poolAbi,
  poolFactoryAbi,
  poolHelperABI,
  protocolRouterAbi,
  veNFTHelperABI,
} from "@/assets/abis";
import {
  __EXCHANGE_HELPER__,
  __POOL_FACTORIES__,
  __POOL_HELPER__,
  __PROTOCOL_ROUTERS__,
  __VE_NFT_HELPER__,
  __WRAPPED_ETHER__,
} from "@/config/constants";
import { RootState } from "@/store";
import { mul } from "@/utils/math";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Address, zeroAddress } from "viem";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
} from "wagmi";

export function useProtocolCore() {
  const chainId = useChainId();
  const { address } = useAccount();
  const routerAddress = useMemo(() => __PROTOCOL_ROUTERS__[chainId], [chainId]);
  const factoryAddress = useMemo(() => __POOL_FACTORIES__[chainId], [chainId]);
  const deadline = useSelector(
    (state: RootState) => state.wallet.executionDeadlineInMinutes,
  );

  const useQuoteAddLiquidity = (
    token0: `0x${string}`,
    token1: `0x${string}`,
    stable: boolean,
    amount0Desired: number,
    amount1Desired: number,
  ) =>
    useReadContract({
      abi: protocolRouterAbi,
      address: routerAddress as `0x${string}`,
      functionName: "quoteAddLiquidity",
      args: [
        token0,
        token1,
        stable,
        factoryAddress as any,
        BigInt(amount0Desired),
        BigInt(amount1Desired),
      ],
    });

  const useQuoteRemoveLiquidity = (
    token0: `0x${string}`,
    token1: `0x${string}`,
    stable: boolean,
    liquidity: number,
  ) =>
    useReadContract({
      abi: protocolRouterAbi,
      address: routerAddress as `0x${string}`,
      functionName: "quoteRemoveLiquidity",
      args: [token0, token1, stable, factoryAddress as any, BigInt(liquidity)],
    });

  const useAllPools = () =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "allPools",
    });

  const useGetPool = (
    token0: `0x${string}`,
    token1: `0x${string}`,
    stable: boolean,
  ) =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "getPool",
      args: [token0, token1, stable],
    });

  const usePoolFee = (pool: `0x${string}`, stable: boolean) =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "getFee",
      args: [pool, stable],
    });

  const useVolatileFee = () =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "volatileFee",
    });

  const useStableFee = () =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "stableFee",
    });

  const useAddLiquidity = (
    token0: `0x${string}`,
    token1: `0x${string}`,
    stable: boolean,
    amount0Desired: number,
    amount1Desired: number,
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
    const isETH = useMemo(
      () =>
        token0.toLowerCase() === __WRAPPED_ETHER__[chainId].toLowerCase() ||
        token1.toLowerCase() === __WRAPPED_ETHER__[chainId].toLowerCase(),
      [token0, token1],
    );
    const nonETHToken = useMemo(
      () =>
        isETH
          ? token0.toLowerCase() !== __WRAPPED_ETHER__[chainId].toLowerCase()
            ? token0
            : token1
          : undefined,
      [isETH, token0, token1],
    );

    const executeAddLiquidityETH = () =>
      writeContract(
        {
          abi: protocolRouterAbi,
          address: routerAddress as `0x${string}`,
          functionName: "addLiquidityETH",
          args: [
            nonETHToken as `0x${string}`,
            stable,
            nonETHToken === token0
              ? BigInt(amount0Desired)
              : BigInt(amount1Desired),
            BigInt(0),
            BigInt(0),
            address as `0x${string}`,
            BigInt(Math.floor(Date.now() / 1000) + mul(deadline, 60)),
          ],
          value:
            nonETHToken === token0
              ? BigInt(amount1Desired)
              : BigInt(amount0Desired),
        },
        { onSettled },
      );

    const executeAddLiquidity = () =>
      writeContract(
        {
          abi: protocolRouterAbi,
          address: routerAddress as `0x${string}`,
          functionName: "addLiquidity",
          args: [
            token0,
            token1,
            stable,
            BigInt(amount0Desired),
            BigInt(amount1Desired),
            BigInt(0),
            BigInt(0),
            address as `0x${string}`,
            BigInt(Math.floor(Date.now() / 1000) + mul(deadline, 60)),
          ],
        },
        { onSettled },
      );

    return {
      executeAddLiquidity,
      executeAddLiquidityETH,
      isError,
      isPending,
      isSuccess,
      hash,
      error,
      reset,
    };
  };

  const useRemoveLiquidity = (
    token0: `0x${string}`,
    token1: `0x${string}`,
    stable: boolean,
    liquidity: number,
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
    const isETH = useMemo(
      () =>
        token0.toLowerCase() === __WRAPPED_ETHER__[chainId].toLowerCase() ||
        token1.toLowerCase() === __WRAPPED_ETHER__[chainId].toLowerCase(),
      [token0, token1],
    );
    const nonETHToken = useMemo(
      () =>
        isETH
          ? token0.toLowerCase() !== __WRAPPED_ETHER__[chainId].toLowerCase()
            ? token0
            : token1
          : undefined,
      [isETH, token0, token1],
    );

    const executeRemoveLiquidity = () =>
      writeContract(
        {
          abi: protocolRouterAbi,
          address: routerAddress as `0x${string}`,
          functionName: isETH
            ? "removeLiquidityETHSupportingFeeOnTransferTokens"
            : "removeLiquidity",
          args: isETH
            ? [
                nonETHToken as `0x${string}`,
                stable,
                BigInt(liquidity),
                BigInt(0),
                BigInt(0),
                address as `0x${string}`,
                BigInt(Math.floor(Date.now() / 1000) + mul(deadline, 60000)),
              ]
            : [
                token0,
                token1,
                stable,
                BigInt(liquidity),
                BigInt(0),
                BigInt(0),
                address as `0x${string}`,
                BigInt(Math.floor(Date.now() / 1000) + mul(deadline, 60000)),
              ],
        },
        { onSettled, onError: (error) => console.error(error) },
      );

    return {
      executeRemoveLiquidity,
      isError,
      isSuccess,
      hash,
      reset,
      error,
      isPending,
    };
  };

  return {
    useAddLiquidity,
    useGetPool,
    useQuoteAddLiquidity,
    useQuoteRemoveLiquidity,
    useRemoveLiquidity,
    useAllPools,
    usePoolFee,
    useStableFee,
    useVolatileFee,
  };
}

export function usePoolExecutions(poolAddress: string) {
  const useClaimFees = (onSettled?: () => any) => {
    const {
      writeContract,
      isError,
      isSuccess,
      isPending,
      data: hash,
      reset,
      error,
    } = useWriteContract();

    const executeClaimFees = () =>
      writeContract(
        {
          address: poolAddress as `0x${string}`,
          abi: poolAbi,
          functionName: "claimFees",
        },
        { onSettled },
      );

    return {
      executeClaimFees,
      isError,
      isSuccess,
      isPending,
      hash,
      reset,
      error,
    };
  };

  return { useClaimFees };
}

export function usePoolMetadata(poolAddress: `0x${string}`) {
  const { address } = useAccount();
  const usePoolName = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "name",
    });

  const usePoolSymbol = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "symbol",
    });

  const usePoolDecimals = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "decimals",
    });

  const usePoolTotalSupply = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "totalSupply",
    });

  const usePoolStability = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "stable",
    });

  const useToken0 = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "token0",
    });
  const useToken1 = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "token1",
    });
  const useReserve0 = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "reserve0",
    });
  const useReserve1 = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "reserve1",
    });

  const useClaimable0 = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "claimable0",
      args: [address as any],
    });

  const useClaimable1 = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "claimable1",
      args: [address as any],
    });

  return {
    usePoolName,
    usePoolSymbol,
    usePoolDecimals,
    usePoolTotalSupply,
    usePoolStability,
    useToken0,
    useToken1,
    useReserve0,
    useReserve1,
    useClaimable0,
    useClaimable1,
  };
}

export function useHelpers() {
  const chainId = useChainId();
  const { address = zeroAddress } = useAccount();
  const poolHelper = useMemo(() => __POOL_HELPER__[chainId], [chainId]);
  const veNFTHelper = useMemo(() => __VE_NFT_HELPER__[chainId], [chainId]);
  const exchangeHelper = useMemo(() => __EXCHANGE_HELPER__[chainId], [chainId]);

  const useGetAllPools = (refetchInterval: number = 30000) => {
    const { data = [], ...rest } = useReadContract({
      address: poolHelper as Address,
      abi: poolHelperABI,
      functionName: "getAllPools",
      args: [address],
      query: { enabled: address !== zeroAddress, refetchInterval },
    });
    return { data, ...rest };
  };

  const useGetSinglePool = (poolAddress: Address, refetchInterval: number = 30000) => {
    const { data, ...rest } = useReadContract({
      address: poolHelper as Address,
      abi: poolHelperABI,
      functionName: "getPool",
      args: [poolAddress, address],
      query: { enabled: address !== zeroAddress && poolAddress !== zeroAddress, refetchInterval },
    });
    return { data: data!, ...rest };
  }

  const useGetAllVeNFTs = (refetchInterval: number = 30000) => {
    const { data = [], ...rest } = useReadContract({
      address: veNFTHelper as Address,
      abi: veNFTHelperABI,
      functionName: "getNFTFromAddress",
      args: [address],
      query: { enabled: address !== zeroAddress, refetchInterval },
    });
    return { data, ...rest };
  };

  const useGetTVL = (refetchInterval: number = 30000) => {
    const { data = [BigInt(0), [], []], ...rest } = useReadContract({
      address: exchangeHelper as Address,
      abi: exchangeHelperABI,
      functionName: "getTVLInUSDForAllPools",
      query: { enabled: true, refetchInterval },
    });
    return { data, ...rest };
  };

  const useGetTVLForPool = (pool: Address, refetchInterval: number = 30000) => {
    const { data = [BigInt(0), BigInt(0), BigInt(0)], ...rest } =
      useReadContract({
        address: exchangeHelper as Address,
        abi: exchangeHelperABI,
        functionName: "getTVLInUSDForPool",
        args: [pool],
        query: { enabled: true, refetchInterval },
      });
    return { data, ...rest };
  };

  const useGetFees = (refetchInterval: number = 30000) => {
    const { data = [BigInt(0), [], []], ...rest } = useReadContract({
      address: exchangeHelper as Address,
      abi: exchangeHelperABI,
      functionName: "getFeesInUSDForAllPools",
      query: { enabled: true, refetchInterval },
    });
    return { data, ...rest };
  };

  const useGetFeesForPool = (
    pool: Address,
    refetchInterval: number = 30000,
  ) => {
    const { data = BigInt(0), ...rest } = useReadContract({
      address: exchangeHelper as Address,
      abi: exchangeHelperABI,
      functionName: "getFeesInUSDForPool",
      args: [pool],
      query: { enabled: true, refetchInterval },
    });
    return { data, ...rest };
  };

  const useGetVolumeLockedPerTime = (
    from: bigint,
    to: bigint,
    refetchInterval: number = 30000,
  ) => {
    const { data = [BigInt(0), [], []], ...rest } = useReadContract({
      address: exchangeHelper as Address,
      abi: exchangeHelperABI,
      functionName: "getTotalVolumeLockedPerTime",
      args: [from, to],
      query: { enabled: true, refetchInterval },
    });
    return { data, ...rest };
  };

  const useGetVolumeLockedPerTimeForPool = (
    pool: Address,
    from: bigint,
    to: bigint,
    refetchInterval: number = 30000,
  ) => {
    const {
      data = [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)],
      ...rest
    } = useReadContract({
      address: exchangeHelper as Address,
      abi: exchangeHelperABI,
      functionName: "getVolumeLockedPerTimeForPool",
      args: [pool, from, to],
      query: { enabled: true, refetchInterval },
    });
    return { data, ...rest };
  };

  return {
    useGetAllPools,
    useGetAllVeNFTs,
    useGetTVL,
    useGetTVLForPool,
    useGetFees,
    useGetFeesForPool,
    useGetVolumeLockedPerTime,
    useGetVolumeLockedPerTimeForPool,
    useGetSinglePool
  };
}

type GetAllPoolsFuncType = ReturnType<typeof useHelpers>["useGetAllPools"];
type GetAllVeNFTsFuncType = ReturnType<typeof useHelpers>["useGetAllVeNFTs"];
export type PoolType = ReturnType<GetAllPoolsFuncType>["data"][number];
export type VeNFTPoolType = ReturnType<GetAllVeNFTsFuncType>["data"][number];
