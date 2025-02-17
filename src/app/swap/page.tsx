"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import SwapIcon from "@/assets/images/swapIcon.svg";
import { ConnectButton } from "@/components/ConnectButton";
import {
  SettingsModal,
  TokenSelectModal,
  TransactionInfoModal,
} from "@/components/Modal";
import { Button } from "@/components/ui/button";
import {
  __AGGREGATOR_ROUTERS__,
  __ETHER__,
  __HONEY__,
  __WRAPPED_ETHER__,
} from "@/config/constants";
import { useGetTokenLists } from "@/hooks/api/tokens";
import { useGetAverageValueInUSD } from "@/hooks/onchain/oracle";
import { useAggregatorRouter } from "@/hooks/onchain/swap";
import {
  useERC20Allowance,
  useERC20Balance,
  useNativeBalance,
} from "@/hooks/onchain/wallet";
import { useWETH_ETHProcesses } from "@/hooks/onchain/weth";
import { RootState } from "@/store";
import { TokenType } from "@/types";
import { toSF } from "@/utils/format";
import { Divider, Input, Spinner } from "@nextui-org/react";
import { ArrowRightLeft, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { useAccount, useChainId, useWatchBlocks } from "wagmi";

export default function Page() {
  const [showTXInfoModal, setShowTXInfoModal] = useState(false);
  const [showModal0, setShowModal0] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [amount, setAmount] = useState(0.0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const { data: tokenLists = [] } = useGetTokenLists({
    variables: { chainId },
  });
  const [selectedTokens, setSelectedTokens] = useState<
    [TokenType | null, TokenType | null]
  >([null, null]);

  const [hasLoadedDefaultTokens, setHasLoadedDefaultTokens] = useState(false);

  const switchTokens = useCallback(() => {
    const selectedToken0 = selectedTokens[0];
    const selectedToken1 = selectedTokens[1];

    setSelectedTokens([selectedToken1, selectedToken0]);
  }, [selectedTokens]);

  const router = useMemo(() => __AGGREGATOR_ROUTERS__[chainId], [chainId]);
  const wrappedEther = useMemo(() => __WRAPPED_ETHER__[chainId], [chainId]);
  const honey = useMemo(() => __HONEY__[chainId], [chainId]);
  const { balance: etherBalance } = useNativeBalance();
  const { balance: token0Balance } = useERC20Balance(
    selectedTokens[0]?.address as any,
  );
  const { balance: token1Balance } = useERC20Balance(
    selectedTokens[1]?.address as any,
  );
  const balance0 = useMemo(
    () =>
      selectedTokens[0]?.address === __ETHER__ ? etherBalance : token0Balance,
    [etherBalance, selectedTokens[0]?.address, token0Balance, selectedTokens],
  );
  const balance1 = useMemo(
    () =>
      selectedTokens[1]?.address === __ETHER__ ? etherBalance : token1Balance,
    [etherBalance, selectedTokens[1]?.address, token1Balance, selectedTokens],
  );

  const address0 = useMemo(
    () =>
      selectedTokens[0]?.address === __ETHER__
        ? wrappedEther
        : selectedTokens[0]?.address,
    [selectedTokens, wrappedEther],
  );
  const address1 = useMemo(
    () =>
      selectedTokens[1]?.address === __ETHER__
        ? wrappedEther
        : selectedTokens[1]?.address,
    [selectedTokens, wrappedEther],
  );

  const slippage = useSelector(
    (state: RootState) => state.wallet.slippageTolerance,
  );
  const maxSteps = useSelector(
    (state: RootState) => state.wallet.swapRoutingSteps,
  );
  const { useBestQuery, useFindBestPath, useSwap } = useAggregatorRouter();
  const {
    data: bestQueryData,
    isFetching: bestQueryFetching,
    refetch: refetchBestQuery,
  } = useBestQuery(
    address0 as any,
    address1 as any,
    Number(parseUnits(amount.toString(), selectedTokens[0]?.decimals ?? 18)),
  );
  const amountOutFormatted = useMemo(
    () =>
      address0 === wrappedEther && address1 === wrappedEther
        ? amount
        : Number(
            formatUnits(
              bestQueryData?.amountOut ?? BigInt(0),
              selectedTokens[1]?.decimals ?? 18,
            ),
          ),
    [
      address0,
      address1,
      bestQueryData?.amountOut,
      selectedTokens,
      wrappedEther,
    ],
  );
  const { data: bestPathData, refetch: refetchBestPath } = useFindBestPath(
    Number(parseUnits(amount.toString(), selectedTokens[0]?.decimals ?? 18)),
    address0 as any,
    address1 as any,
    maxSteps,
  );
  const {
    executeSwap,
    isError: swapError,
    isPending: swapPending,
    isSuccess: swapSuccess,
    hash: swapHash,
    reset: resetSwap,
  } = useSwap(
    {
      amountIn: parseUnits(
        amount.toString(),
        selectedTokens[0]?.decimals ?? 18,
      ),
      amountOut: parseUnits(
        (amountOutFormatted - (slippage / 100) * amountOutFormatted).toString(),
        selectedTokens[1]?.decimals ?? 18,
      ),
      path: bestPathData?.path ?? [],
      adapters: bestPathData?.adapters ?? [],
    },
    () => setShowTXInfoModal(true),
  );

  const {
    executeDeposit,
    executeWithdrawal,
    isError: wethEthError,
    isPending: wethEthPending,
    isSuccess: wethEthSuccess,
    hash: wethEthHash,
    reset: resetWethEthSwap,
  } = useWETH_ETHProcesses(amount, () => setShowTXInfoModal(true));

  const executeTx = useCallback(() => {
    if (address0 === wrappedEther && address1 === wrappedEther) {
      if (selectedTokens[0]!.address === __ETHER__) executeDeposit();
      else executeWithdrawal();
    } else executeSwap();
  }, [
    address0,
    address1,
    executeDeposit,
    executeSwap,
    executeWithdrawal,
    selectedTokens,
    wrappedEther,
  ]);

  const { useAllowance, useApproval } = useERC20Allowance(address0 as any);
  const { data: allowance, refetch: refetchAllowance } = useAllowance(
    router as any,
  );
  const allowedToSpend = useMemo(
    () =>
      Number(
        formatUnits(allowance ?? BigInt(0), selectedTokens[0]?.decimals ?? 18),
      ),
    [allowance, selectedTokens],
  );
  const { executeApproval, isPending: approvalPending } = useApproval(
    router as any,
    Number(parseUnits(amount.toString(), selectedTokens[0]?.decimals ?? 18)),
  );

  const {
    data: amountInUSDValue = [BigInt(0), BigInt(0)],
    refetch: refetchAmountInUSDValue,
  } = useGetAverageValueInUSD(
    address0 ?? zeroAddress,
    parseUnits(amount.toString(), selectedTokens[0]?.decimals ?? 18),
  );
  const {
    data: amountOutUSDValue = [BigInt(0), BigInt(0)],
    refetch: refetchAmountOutUSDValue,
  } = useGetAverageValueInUSD(
    address1 ?? zeroAddress,
    parseUnits(
      amountOutFormatted.toString(),
      selectedTokens[1]?.decimals ?? 18,
    ),
  );

  useEffect(() => {
    if (!hasLoadedDefaultTokens) {
      if (tokenLists.length) {
        const token0 = tokenLists.find(
          (token) => token.address.toLowerCase() === honey.toLowerCase(),
        );
        const token1 = tokenLists.find(
          (token) => token.address.toLowerCase() === __ETHER__.toLowerCase(),
        );

        if (selectedTokens[0] === null && selectedTokens[1] === null) {
          setSelectedTokens([token0 as any, token1 as any]);
        }
        setHasLoadedDefaultTokens(true);
      }
    }
  }, [hasLoadedDefaultTokens, tokenLists, honey, selectedTokens]);

  useWatchBlocks({
    onBlock: async () => {
      const promises: Promise<any>[] = [];

      promises.push(refetchAmountInUSDValue(), refetchAmountOutUSDValue());

      if (amount > 0)
        promises.push(
          refetchBestQuery(),
          refetchBestPath(),
          refetchAllowance(),
        );

      await Promise.all(promises);
    },
  });

  return (
    <div className="p-5 pb-20">
      <Image
        src={BEAR1}
        alt="bear"
        className="absolute left-[50%] top-0 translate-x-[-50%]"
        width={350}
      />
      <div className="z-1 relative m-auto mt-32 flex max-w-[620px] flex-col gap-10">
        <div className="flex w-full flex-col gap-10 bg-footer p-8">
          <div className="flex flex-col gap-3 text-sm sm:text-base">
            <p className="flex justify-between">
              <span>Swap</span>
              <span
                className="cursor-pointer text-swapBox"
                onClick={() => setAmount(balance0)}
              >
                Available {balance0.toFixed(4)} {selectedTokens[0]?.symbol}
              </span>
            </p>

            <div className="flex items-center justify-between">
              <button
                className="flex h-[50px] flex-[2_2_0%] cursor-pointer items-center justify-between border-b border-l border-t border-swapBox bg-btn-black px-3"
                onClick={() => setShowModal0(true)}
              >
                {selectedTokens[0] && (
                  <div className="flex items-center gap-3">
                    <Image
                      src={selectedTokens[0].logoURI}
                      alt={selectedTokens[0].symbol}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>{selectedTokens[0].symbol}</span>
                  </div>
                )}

                <ChevronDown />
              </button>

              <div className="flex h-[50px] flex-[3_3_0%] items-center justify-between border border-swapBox bg-btn-black p-3">
                <Input
                  value={amount.toString() === "0" ? "" : amount.toString()}
                  type="number"
                  onChange={(ev) => setAmount(Number(ev.target.value))}
                  placeholder="0.0"
                  classNames={{
                    input: "text-right outline-none bg-transparent !text-white",
                    inputWrapper:
                      "bg-transparent group-data-[focus=true]:bg-transparent group-data-[hover=true]:bg-transparent h-full min-h-0",
                  }}
                />
              </div>
            </div>
            <p className="text-right text-swapBox">
              ${toSF(formatUnits(amountInUSDValue[0], 18))}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={switchTokens}
              className="absolute left-[50%] top-[50%] flex size-[40px] translate-x-[-50%] translate-y-[-50%] cursor-pointer items-center justify-center rounded-2xl bg-[#47473F]"
            >
              <Image src={SwapIcon} alt="swap icon" />
            </button>
            <Divider className="my-4 bg-[#494646]" />
          </div>

          <div className="flex flex-col gap-3 text-sm sm:text-base">
            <p className="flex justify-between">
              <span>For</span>
              <span className="text-swapBox">
                Available {balance1.toFixed(4)} {selectedTokens[1]?.symbol}
              </span>
            </p>

            <div className="flex items-center justify-between">
              <button
                className="flex h-[50px] flex-[2_2_0%] cursor-pointer items-center justify-between border-b border-l border-t border-swapBox bg-btn-black px-3"
                onClick={() => setShowModal1(true)}
              >
                {selectedTokens[1] && (
                  <div className="flex items-center gap-3">
                    <Image
                      src={selectedTokens[1].logoURI}
                      alt={selectedTokens[1].symbol}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span>{selectedTokens[1].symbol}</span>
                  </div>
                )}

                <ChevronDown />
              </button>

              <div className="flex h-[50px] flex-[3_3_0%] items-center justify-between border border-swapBox bg-btn-black p-3">
                <Input
                  disabled
                  value={amountOutFormatted.toString()}
                  placeholder="0.0"
                  classNames={{
                    input: "text-right outline-none bg-transparent !text-white",
                    inputWrapper:
                      "bg-transparent group-data-[focus=true]:bg-transparent group-data-[hover=true]:bg-transparent h-full min-h-0",
                  }}
                />
              </div>
            </div>
            <p className="text-right text-swapBox">
              ${toSF(formatUnits(amountOutUSDValue[0], 18))}
            </p>
          </div>
        </div>

        <div>
          {isConnected ? (
            <>
              {allowedToSpend >= amount ||
              selectedTokens[0]?.address === __ETHER__ ||
              (address0 === wrappedEther && address1 === wrappedEther) ? (
                <Button
                  onClick={executeTx}
                  isLoading={swapPending || wethEthPending}
                  className="capitalize"
                  variant="primary"
                  size="full"
                  disabled={
                    selectedTokens[0] === null ||
                    selectedTokens[1] === null ||
                    swapPending ||
                    wethEthPending ||
                    amount <= 0
                  }
                >
                  {address0 === wrappedEther && address1 === wrappedEther
                    ? selectedTokens[0]?.address === __ETHER__
                      ? "wrap"
                      : "unwrap"
                    : "swap"}
                </Button>
              ) : (
                <Button
                  onClick={executeApproval}
                  isLoading={approvalPending}
                  className="capitalize"
                  variant="primary"
                  size="full"
                  disabled={selectedTokens[0] === null || approvalPending}
                >
                  allow {selectedTokens[0]?.symbol}
                </Button>
              )}
            </>
          ) : (
            <ConnectButton className="w-full" />
          )}
        </div>

        {isConnected &&
          selectedTokens[0] !== null &&
          selectedTokens[1] !== null &&
          amount > 0 && (
            <div className="flex flex-col gap-5 bg-footer p-8 text-xs sm:text-base">
              <div className="flex items-center justify-between">
                <div className="text-swapBox">
                  Exchange rate found...{" "}
                  <a
                    onClick={async () => await refetchBestQuery()}
                    className="cursor-pointer underline"
                  >
                    Refresh
                  </a>
                  {bestQueryFetching && <Spinner size="sm" color="default" />}
                </div>
                <p className="flex flex-col gap-2 text-textgray sm:flex-row">
                  <span className="flex gap-2">
                    1 {selectedTokens[0].symbol} <ArrowRightLeft />
                  </span>{" "}
                  <span>
                    {(amountOutFormatted / amount).toFixed(4)}{" "}
                    {selectedTokens[1].symbol}
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

              <p className="flex items-center justify-between">
                <span className="text-swapBox">Minimum received</span>
                <span className="text-textgray">
                  {amountOutFormatted.toFixed(4)} {selectedTokens[1].symbol}
                </span>
              </p>
            </div>
          )}
      </div>

      <TokenSelectModal
        isOpen={showModal0}
        selectedTokens={selectedTokens as [TokenType, TokenType]}
        close={() => setShowModal0(false)}
        tokenLists={tokenLists}
        onItemClick={(t) => setSelectedTokens([t, selectedTokens[1]])}
      />
      <TokenSelectModal
        isOpen={showModal1}
        selectedTokens={selectedTokens as [TokenType, TokenType]}
        close={() => setShowModal1(false)}
        tokenLists={tokenLists}
        onItemClick={(t) => setSelectedTokens([selectedTokens[0], t])}
      />
      <SettingsModal
        isOpen={showSettingsModal}
        close={() => setShowSettingsModal(false)}
      />
      <TransactionInfoModal
        isOpen={showTXInfoModal}
        close={() => {
          setShowTXInfoModal(false);
          if (address0 === wrappedEther && address1 === wrappedEther)
            resetWethEthSwap();
          else resetSwap();
        }}
        type={
          swapSuccess || wethEthSuccess
            ? "success"
            : swapError || wethEthError
              ? "failure"
              : "failure"
        }
        txHash={swapHash ?? wethEthHash}
      />
    </div>
  );
}
