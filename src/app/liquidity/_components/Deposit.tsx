"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import { ConnectButton } from "@/components/ConnectButton";
import { SettingsModal, TransactionInfoModal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { ChipBadge } from "@/components/ui/chipBadge";
import {
  __ETHER__,
  __PROTOCOL_ROUTERS__,
  __WRAPPED_ETHER__,
} from "@/config/constants";
import { type ERC20ItemType } from "@/hooks/api/tokens";
import { useSinglePoolInfo } from "@/hooks/graphql/core";
import { useHelpers, usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { useGaugeCore } from "@/hooks/onchain/gauge";
import { useGetAverageValueInUSD } from "@/hooks/onchain/oracle";
import { useVoterCore } from "@/hooks/onchain/voting";
import {
  useERC20Allowance,
  useGetBalance
} from "@/hooks/onchain/wallet";
import { RootState } from "@/store";
import { TokenType } from "@/types";
import { toSF, treatETHAsWETHIfApplicable } from "@/utils/format";
import { div } from "@/utils/math";
import { Divider, Input, Spinner } from "@nextui-org/react";
import { ChevronDown, Plus, Scale } from "lucide-react";
import Image from "next/image";
import { FC, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { formatEther, formatUnits, parseUnits, zeroAddress } from "viem";
import { useAccount, useChainId, useWatchBlocks } from "wagmi";

type DepositProps = {
  token0: ERC20ItemType;
  token1: ERC20ItemType;
  stable: boolean;
};

export const Deposit: FC<DepositProps> = ({ token0, token1, stable }) => {
  const [amount0, setAmount0] = useState(0);
  const [amount1, setAmount1] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTXInfoModal, setShowTXInfoModal] = useState(false);
  const { isConnected } = useAccount();

  const chainId = useChainId();

  const wrappedEther = useMemo(() => __WRAPPED_ETHER__[chainId], [chainId]);
  const router = useMemo(() => __PROTOCOL_ROUTERS__[chainId], [chainId]);
  const firstAddress = treatETHAsWETHIfApplicable(token0.address, chainId);
  const secondAddress = treatETHAsWETHIfApplicable(token0.address, chainId);

  const { useGetPool: useGetPoolAddress, useAddLiquidity, useQuoteAddLiquidity, usePoolFee } =
    useProtocolCore();
  const { data: poolAddress = zeroAddress } = useGetPoolAddress(
    firstAddress,
    secondAddress,
    stable,
  );
  const { useGetSinglePool } = useHelpers();
  const { data: poolInformation, refetch: refetchPoolInformation } = useGetSinglePool(poolAddress);
  const { data: fee } = usePoolFee(poolInformation.pool_address ?? zeroAddress, poolInformation.stable ?? stable);
  const { balance: token0Balance } = useGetBalance(token0.address);
  const { balance: token1Balance } = useGetBalance(token1.address);
  const positionRatio = useMemo(
    () => (poolInformation.account_lp_balance * BigInt(1000)) / poolInformation.total_supply,
    [poolInformation.account_lp_balance, poolInformation.total_supply],
  );
  const token0Deposited = useMemo(
    () => (positionRatio * poolInformation.reserve0) / BigInt(1000),
    [poolInformation.reserve0, positionRatio],
  );
  const token1Deposited = useMemo(
    () => (positionRatio * poolInformation.reserve1) / BigInt(1000),
    [poolInformation.reserve1, positionRatio],
  );

  const {
    data: quote,
    isFetching: quoteFetching,
    refetch: refetchQuote,
  } = useQuoteAddLiquidity(
    firstAddress,
    secondAddress,
    stable,
    Number(parseUnits(amount0.toString(), token0.decimals)),
    Number(parseUnits(amount1.toString(), token1.decimals)),
  );

  const {
    executeAddLiquidity,
    executeAddLiquidityETH,
    hash: depositHash,
    isPending: depositPending,
    isSuccess: depositSuccess,
    isError: depositError,
    reset: resetDeposit,
  } = useAddLiquidity(
    firstAddress,
    secondAddress,
    stable,
    Number(parseUnits(amount0.toString(), token0.decimals)),
    Number(parseUnits(amount1.toString(), token1.decimals)),
    () => setShowTXInfoModal(true),
  );

  const executeTx = useCallback(
    () =>
      token0.address.toLowerCase() === __ETHER__.toLowerCase() ||
      token1.address.toLowerCase() === __ETHER__.toLowerCase()
        ? executeAddLiquidityETH()
        : executeAddLiquidity(),
    [token0.address, token1.address, executeAddLiquidityETH, executeAddLiquidity],
  );

  const { useAllowance: useAllowance0, useApproval: useApproval0 } =
    useERC20Allowance(firstAddress as any);
  const { useAllowance: useAllowance1, useApproval: useApproval1 } =
    useERC20Allowance(secondAddress as any);
  const { data: allowance0, refetch: refetchAllowance0 } = useAllowance0(
    router as any,
  );
  const { data: allowance1, refetch: refetchAllowance1 } = useAllowance1(
    router as any,
  );
  const allowedToSpend0 = useMemo(
    () => Number(formatUnits(allowance0 ?? BigInt(0), token0.decimals)),
    [allowance0, token0.decimals],
  );

  const allowedToSpend1 = useMemo(
    () => Number(formatUnits(allowance1 ?? BigInt(0), token1.decimals)),
    [allowance1, token1.decimals],
  );
  const { executeApproval: executeApproval0, isPending: approval0Pending } =
    useApproval0(
      router as any,
      Number(parseUnits(amount0.toString(), token0.decimals)),
    );

  const { executeApproval: executeApproval1, isPending: approval1Pending } =
    useApproval1(
      router as any,
      Number(parseUnits(amount1.toString(), token1.decimals)),
    );

  const slippage = useSelector(
    (state: RootState) => state.wallet.slippageTolerance,
  );

  const { useGetPoolGauge } = useVoterCore();

  const { data: gaugeId = zeroAddress, refetch: refetchGaugeId } =
    useGetPoolGauge(poolAddress);
  const { useGaugeReadables } = useGaugeCore();
  const { useRewardRate } = useGaugeReadables(gaugeId);
  const { data: rewardRate = BigInt(0), refetch: refetchRewardRate } =
    useRewardRate();

  const {
    data: amount0USDValue = [BigInt(0), BigInt(0)],
    refetch: refetchAmount0USDValue,
  } = useGetAverageValueInUSD(
    firstAddress ?? zeroAddress,
    parseUnits(amount0.toString(), token0.decimals),
  );
  const {
    data: amount1USDValue = [BigInt(0), BigInt(0)],
    refetch: refetchAmount1USDValue,
  } = useGetAverageValueInUSD(
    secondAddress ?? zeroAddress,
    parseUnits(amount1.toString(), token1.decimals),
  );

  useWatchBlocks({
    onBlock: async () => {
      await Promise.all([
        refetchAmount0USDValue(),
        refetchAmount1USDValue(),
        refetchAllowance0(),
        refetchAllowance1(),
        refetchQuote(),
        refetchGaugeId(),
        refetchRewardRate(),
      ]);
    },
  });

  return (
    <div className="flex justify-center p-5 pb-20">
      <div className="flex flex-col justify-start gap-5">
        <Image
          src={BEAR1}
          alt="bear"
          className="absolute left-[50%] top-0 translate-x-[-50%]"
          width={350}
        />
        <div className="z-1 relative m-auto mt-32 flex w-full max-w-[620px] flex-col gap-4 bg-[#161616] p-5 lg:w-[700px]">
          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex items-center justify-center gap-1">
              <div className="flex items-center">
                <Image
                  src={token0.logoURI}
                  alt="icon"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <Image
                  src={token1.logoURI}
                  alt="icon"
                  width={30}
                  height={30}
                  className="-translate-x-3 rounded-full"
                />
              </div>
              <div>
                <>
                  {!!poolInformation ? (
                    <span>{poolInformation.symbol}</span>
                  ) : (
                    <span>
                      {stable ? "sAMM" : "vAMM"}-{token0.symbol}/{token1.symbol}
                    </span>
                  )}
                </>
                <ChipBadge>
                  Basic {stable ? "Stable" : "Volatile"} ·
                  {Number(fee ?? 0) / 100}%
                </ChipBadge>
              </div>
            </div>

            <div className="flex flex-col items-end justify-end gap-2">
              <span className="uppercase text-swapBox">apr</span>
              <span className="text-swapBox">
                {toSF(formatEther(rewardRate))}%
              </span>
            </div>
          </div>
          <Divider className="my-4 w-full bg-[#494646]" />

          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex flex-col items-start justify-start gap-2">
              <span className="capitalize text-swapBox">liquidity</span>
              <div className="flex flex-col items-start justify-start gap-1">
                <div>
                  <span className="text-swapBox">
                    {!!pair ? toSF(pair.reserve0) : 0.0}
                  </span>{" "}
                  <span>{pair?.token0.symbol ?? token0.symbol}</span>
                </div>

                <div>
                  <span className="text-swapBox">
                    {!!pair ? toSF(pair.reserve1) : 0.0}
                  </span>{" "}
                  <span>{pair?.token1.symbol ?? token1.symbol}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-start gap-2">
              <span className="capitalize text-swapBox">your positions</span>
              <div className="flex flex-col items-end justify-start gap-1">
                <div>
                  <span className="text-swapBox">
                    {!!poolInformation ? toSF(token0Deposited) : 0.0}
                  </span>{" "}
                  <span>{poolInformation?.token0_symbol ?? token0.symbol}</span>
                </div>

                <div>
                  <span className="text-swapBox">
                    {!!poolInformation ? toSF(token1Deposited) : 0.0}
                  </span>{" "}
                  <span>{poolInformation.token1_symbol ?? token1.symbol}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="z-1 relative flex max-w-[620px] flex-col gap-10 lg:w-[700px]">
          <div className="flex w-full flex-col gap-10 bg-footer p-8">
            <div className="flex flex-col gap-3 text-sm sm:text-base">
              <p className="flex justify-between">
                <span>Token Amount</span>
                <span className="text-swapBox">
                  Available {toSF(formatUnits(token0Balance, token0.decimals))} {token0.symbol}
                </span>
              </p>

              <div className="flex items-center justify-between">
                <button
                  disabled
                  className="flex h-[50px] flex-[2_2_0%] cursor-pointer items-center justify-between border-b border-l border-t border-swapBox bg-btn-black px-3"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={token0.logoURI}
                      alt={token0.symbol}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>{token0.symbol}</span>
                  </div>

                  <ChevronDown />
                </button>

                <div className="flex h-[50px] flex-[3_3_0%] items-center justify-between border border-swapBox bg-btn-black p-3">
                  <Input
                    value={amount0.toString()}
                    type="number"
                    onChange={(ev) => setAmount0(Number(ev.target.value))}
                    placeholder="0.0"
                    classNames={{
                      input:
                        "text-right outline-none bg-transparent !text-white",
                      inputWrapper:
                        "bg-transparent group-data-[focus=true]:bg-transparent group-data-[hover=true]:bg-transparent h-full min-h-0",
                    }}
                  />
                </div>
              </div>
              <p className="text-right text-swapBox">
                ${toSF(formatUnits(amount0USDValue[0], 18))}
              </p>
            </div>

            <div className="relative">
              <button
                disabled
                className="absolute left-[50%] top-[50%] flex size-[40px] translate-x-[-50%] translate-y-[-50%] cursor-pointer items-center justify-center rounded-2xl bg-[#47473F]"
              >
                <Plus />
              </button>
              <Divider className="my-4 bg-[#494646]" />
            </div>

            <div className="flex flex-col gap-3 text-sm sm:text-base">
              <p className="flex justify-between">
                <span>Token Amount</span>
                <span className="text-swapBox">
                  Available {balance1.toFixed(4)} {token1.symbol}
                </span>
              </p>

              <div className="flex items-center justify-between">
                <button
                  className="flex h-[50px] flex-[2_2_0%] cursor-pointer items-center justify-between border-b border-l border-t border-swapBox bg-btn-black px-3"
                  disabled
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={token1.logoURI}
                      alt={token1.symbol}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>{token1.symbol}</span>
                  </div>

                  <ChevronDown />
                </button>

                <div className="flex h-[50px] flex-[3_3_0%] items-center justify-between border border-swapBox bg-btn-black p-3">
                  <Input
                    type="number"
                    value={amount1.toString()}
                    onChange={(ev) => setAmount1(Number(ev.target.value))}
                    placeholder="0.0"
                    classNames={{
                      input:
                        "text-right outline-none bg-transparent !text-white",
                      inputWrapper:
                        "bg-transparent group-data-[focus=true]:bg-transparent group-data-[hover=true]:bg-transparent h-full min-h-0",
                    }}
                  />
                </div>
              </div>
              <p className="text-right text-swapBox">
                ${toSF(formatUnits(amount1USDValue[0], 18))}
              </p>
            </div>
          </div>

          <div className="w-full">
            {isConnected ? (
              <>
                {(token0.address !== __ETHER__
                  ? allowedToSpend0 >= amount0
                  : amount0 <= balance0) &&
                (token1.address !== __ETHER__
                  ? allowedToSpend1 >= amount1
                  : amount1 <= balance1) &&
                amount0 > 0 &&
                amount1 > 0 ? (
                  <Button
                    onClick={executeTx}
                    isLoading={depositPending}
                    className="capitalize"
                    variant="primary"
                    size="full"
                    disabled={depositPending}
                  >
                    deposit
                  </Button>
                ) : (
                  <div className="flex w-full flex-col justify-center gap-3">
                    {allowedToSpend0 < amount0 &&
                      token0.address !== __ETHER__ && (
                        <Button
                          onClick={executeApproval0}
                          isLoading={approval0Pending}
                          className="capitalize"
                          variant="primary"
                          size="full"
                          fullWidth
                          disabled={approval0Pending}
                        >
                          allow {token0.symbol}
                        </Button>
                      )}
                    {allowedToSpend1 < amount1 &&
                      token1.address !== __ETHER__ && (
                        <Button
                          onClick={executeApproval1}
                          isLoading={approval1Pending}
                          className="capitalize"
                          variant="primary"
                          size="full"
                          fullWidth
                          disabled={approval1Pending}
                        >
                          allow {token1.symbol}
                        </Button>
                      )}
                  </div>
                )}
              </>
            ) : (
              <ConnectButton className="w-full" />
            )}
          </div>

          {isConnected && amount0 > 0 && amount1 > 0 && (
            <div className="flex flex-col gap-5 bg-footer p-8 text-xs sm:text-base">
              <div className="flex items-center justify-between">
                <p className="text-swapBox">
                  Quote for deposit received...{" "}
                  <a
                    onClick={async () => await refetchQuote()}
                    className="cursor-pointer underline"
                  >
                    Refresh
                  </a>
                  {quoteFetching && <Spinner size="sm" color="default" />}
                </p>
                <p className="flex flex-col gap-2 text-textgray sm:flex-row">
                  <span className="flex gap-2">
                    1 {token0.symbol} <Scale />
                  </span>{" "}
                  <span>
                    {(
                      Number(
                        formatUnits(
                          quote ? quote[1] : BigInt(0),
                          token1.decimals,
                        ),
                      ) / amount0
                    ).toFixed(4)}{" "}
                    {token1.symbol}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-swapBox">
                  Slippage applied...{" "}
                  <span
                    onClick={() => setShowSettingsModal(true)}
                    className="cursor-pointer underline"
                  >
                    Adjust
                  </span>
                </p>
                <p className="text-textgray">{slippage}%</p>
              </div>

              {/* <p className="flex items-center justify-between">
                            <span className="text-swapBox">
                                Minimum received
                            </span>
                            <span className="text-textgray">
                                {amountOutFormatted.toFixed(4)}{" "}
                                {selectedTokens[1].symbol}
                            </span>
                        </p> */}
            </div>
          )}
        </div>
      </div>
      <SettingsModal
        isOpen={showSettingsModal}
        close={() => setShowSettingsModal(false)}
      />
      <TransactionInfoModal
        isOpen={showTXInfoModal}
        close={() => {
          setShowTXInfoModal(false);
          resetDeposit();
        }}
        type={depositSuccess ? "success" : depositError ? "failure" : "failure"}
        txHash={depositHash}
      />
    </div>
  );
};
