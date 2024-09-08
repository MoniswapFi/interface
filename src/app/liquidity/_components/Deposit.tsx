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
import { useSinglePoolInfo } from "@/hooks/graphql/core";
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import {
    useERC20Allowance,
    useERC20Balance,
    useNativeBalance,
} from "@/hooks/onchain/wallet";
import { RootState } from "@/store";
import { TokenType } from "@/types";
import { div } from "@/utils/math";
import { Divider, Input, Spinner } from "@nextui-org/react";
import { ChevronDown, Plus, Scale } from "lucide-react";
import Image from "next/image";
import { FC, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { useAccount, useChainId, useWatchBlocks } from "wagmi";

type DepositProps = {
    token0: TokenType;
    token1: TokenType;
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
    const firstAddress = useMemo(
        () => (token0.address === __ETHER__ ? wrappedEther : token0.address),
        [wrappedEther, token0.address],
    );
    const secondAddress = useMemo(
        () => (token1.address === __ETHER__ ? wrappedEther : token1.address),
        [wrappedEther, token1.address],
    );

    const { useGetPool, useAddLiquidity, useQuoteAddLiquidity, usePoolFee } =
        useProtocolCore();
    const { data: poolAddress = zeroAddress } = useGetPool(
        firstAddress as any,
        secondAddress as any,
        stable,
    );
    const { data: fee } = usePoolFee(poolAddress as any, stable);
    const { usePoolSymbol, usePoolTotalSupply } = usePoolMetadata(
        poolAddress as any,
    );
    const { data: poolSymbol } = usePoolSymbol();
    const { data: poolTotalSupply, refetch: refetchPoolSupply } =
        usePoolTotalSupply();
    const useIndexedPool = useSinglePoolInfo(poolAddress?.toLowerCase());
    const { data: pair, refetch: refetchPair } = useIndexedPool();

    const { balance: etherBalance } = useNativeBalance();
    const { balance: token0Balance } = useERC20Balance(token0.address as any);
    const { balance: token1Balance } = useERC20Balance(token1.address as any);
    const balance0 = useMemo(
        () => (token0.address === __ETHER__ ? etherBalance : token0Balance),
        [etherBalance, token0.address, token0Balance],
    );
    const balance1 = useMemo(
        () => (token1.address === __ETHER__ ? etherBalance : token1Balance),
        [etherBalance, token0.address, token1Balance],
    );
    const { balance: position } = useERC20Balance(poolAddress as any);
    const formattedTS = useMemo(
        () => Number(formatUnits(poolTotalSupply ?? BigInt(1), 18)),
        [poolTotalSupply],
    );
    const positionRatio = useMemo(
        () => div(position, formattedTS),
        [formattedTS, position],
    );
    const token0Deposited = useMemo(
        () => positionRatio * Number(pair?.reserve0 ?? "0"),
        [pair?.reserve0, positionRatio],
    );
    const token1Deposited = useMemo(
        () => positionRatio * Number(pair?.reserve1 ?? "0"),
        [pair?.reserve1, positionRatio],
    );

    const {
        data: quote,
        isFetching: quoteFetching,
        refetch: refetchQuote,
    } = useQuoteAddLiquidity(
        firstAddress as any,
        secondAddress as any,
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
        firstAddress as any,
        secondAddress as any,
        stable,
        Number(parseUnits(amount0.toString(), token0.decimals)),
        Number(parseUnits(amount1.toString(), token1.decimals)),
        () => setShowTXInfoModal(true),
    );

    const executeTx = useCallback(
        () =>
            firstAddress.toLowerCase() === wrappedEther.toLowerCase() ||
            secondAddress.toLowerCase() === wrappedEther.toLowerCase()
                ? executeAddLiquidityETH()
                : executeAddLiquidity(),
        [
            firstAddress,
            secondAddress,
            executeAddLiquidity,
            executeAddLiquidityETH,
            wrappedEther,
        ],
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

    useWatchBlocks({
        onBlock: async () => {
            await refetchAllowance0();
            await refetchAllowance1();
            await refetchPoolSupply();
            await refetchPair();
            await refetchQuote();
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
                                    {!!poolAddress &&
                                    poolAddress !== zeroAddress ? (
                                        <span>{poolSymbol}</span>
                                    ) : (
                                        <span>
                                            {stable ? "sAMM" : "vAMM"}-
                                            {token0.symbol}/{token1.symbol}
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
                            <span className="text-swapBox">0.00%</span>
                        </div>
                    </div>
                    <Divider className="my-4 w-full bg-[#494646]" />

                    <div className="flex w-full items-start justify-between gap-3">
                        <div className="flex flex-col items-start justify-start gap-2">
                            <span className="capitalize text-swapBox">
                                liquidity
                            </span>
                            <div className="flex flex-col items-start justify-start gap-1">
                                <div>
                                    <span className="text-swapBox">
                                        {!!pair
                                            ? Number(
                                                  pair.reserve0,
                                              ).toLocaleString("en-US", {
                                                  maximumFractionDigits: 3,
                                                  useGrouping: true,
                                              })
                                            : 0.0}
                                    </span>{" "}
                                    <span>
                                        {pair?.token0.symbol ?? token0.symbol}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-swapBox">
                                        {!!pair
                                            ? Number(
                                                  pair.reserve1,
                                              ).toLocaleString("en-US", {
                                                  maximumFractionDigits: 3,
                                                  useGrouping: true,
                                              })
                                            : 0.0}
                                    </span>{" "}
                                    <span>
                                        {pair?.token1.symbol ?? token1.symbol}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end justify-start gap-2">
                            <span className="capitalize text-swapBox">
                                your positions
                            </span>
                            <div className="flex flex-col items-end justify-start gap-1">
                                <div>
                                    <span className="text-swapBox">
                                        {!!pair
                                            ? Number(
                                                  token0Deposited,
                                              ).toLocaleString("en-US", {
                                                  maximumFractionDigits: 3,
                                                  useGrouping: true,
                                              })
                                            : 0.0}
                                    </span>{" "}
                                    <span>
                                        {pair?.token0.symbol ?? token0.symbol}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-swapBox">
                                        {!!pair
                                            ? Number(
                                                  token1Deposited,
                                              ).toLocaleString("en-US", {
                                                  maximumFractionDigits: 3,
                                                  useGrouping: true,
                                              })
                                            : 0.0}
                                    </span>{" "}
                                    <span>
                                        {pair?.token1.symbol ?? token1.symbol}
                                    </span>
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
                                    Available {balance0.toFixed(4)}{" "}
                                    {token0.symbol}
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
                                        />
                                        <span>{token0.symbol}</span>
                                    </div>

                                    <ChevronDown />
                                </button>

                                <div className="flex h-[50px] flex-[3_3_0%] items-center justify-between border border-swapBox bg-btn-black p-3">
                                    <Input
                                        value={amount0.toString()}
                                        type="number"
                                        onChange={(ev) =>
                                            setAmount0(Number(ev.target.value))
                                        }
                                        placeholder="0.0"
                                        classNames={{
                                            input: "text-right outline-none bg-transparent !text-white",
                                            inputWrapper:
                                                "bg-transparent group-data-[focus=true]:bg-transparent group-data-[hover=true]:bg-transparent h-full min-h-0",
                                        }}
                                    />
                                </div>
                            </div>
                            <p className="text-right text-swapBox">$23.45</p>
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
                                    Available {balance1.toFixed(4)}{" "}
                                    {token1.symbol}
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
                                        />
                                        <span>{token1.symbol}</span>
                                    </div>

                                    <ChevronDown />
                                </button>

                                <div className="flex h-[50px] flex-[3_3_0%] items-center justify-between border border-swapBox bg-btn-black p-3">
                                    <Input
                                        type="number"
                                        value={amount1.toString()}
                                        onChange={(ev) =>
                                            setAmount1(Number(ev.target.value))
                                        }
                                        placeholder="0.0"
                                        classNames={{
                                            input: "text-right outline-none bg-transparent !text-white",
                                            inputWrapper:
                                                "bg-transparent group-data-[focus=true]:bg-transparent group-data-[hover=true]:bg-transparent h-full min-h-0",
                                        }}
                                    />
                                </div>
                            </div>
                            <p className="text-right text-swapBox">$23.45</p>
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
                                        onClick={async () =>
                                            await refetchQuote()
                                        }
                                        className="cursor-pointer underline"
                                    >
                                        Refresh
                                    </a>
                                    {quoteFetching && (
                                        <Spinner size="sm" color="default" />
                                    )}
                                </p>
                                <p className="flex flex-col gap-2 text-textgray sm:flex-row">
                                    <span className="flex gap-2">
                                        1 {token0.symbol} <Scale />
                                    </span>{" "}
                                    <span>
                                        {(
                                            Number(
                                                formatUnits(
                                                    quote
                                                        ? quote[1]
                                                        : BigInt(0),
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
                                        onClick={() =>
                                            setShowSettingsModal(true)
                                        }
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
                type={
                    depositSuccess
                        ? "success"
                        : depositError
                          ? "failure"
                          : "failure"
                }
                txHash={depositHash}
            />
        </div>
    );
};
