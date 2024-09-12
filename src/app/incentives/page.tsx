"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import { ConnectButton } from "@/components/ConnectButton";
import { TokenSelectModal, TransactionInfoModal } from "@/components/Modal";
import { IncentiveSelectModal } from "@/components/Modal/IncentiveSelectModal";
import { Button } from "@/components/ui/button";
import { ChipBadge } from "@/components/ui/chipBadge";
import { __ETHER__, __MONI__ } from "@/config/constants";
import type { Pair } from "@/graphclient";
import { useGetTokenLists } from "@/hooks/api/tokens";
import { useAllPools } from "@/hooks/graphql/core";
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { useGaugeCore } from "@/hooks/onchain/gauge";
import { useRewardsCore } from "@/hooks/onchain/rewards";
import { useVoterCore } from "@/hooks/onchain/voting";
import {
    useERC20Allowance,
    useERC20Balance,
    useERC20BalanceOfOther,
    useNativeBalance,
} from "@/hooks/onchain/wallet";
import { TokenType } from "@/types";
import { toSF } from "@/utils/format";
import { div } from "@/utils/math";
import { Divider, Input } from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { useAccount, useChainId, useWatchBlocks } from "wagmi";

export default function Page() {
    const [amount, setAmount] = useState(0.0);
    const [showModal, setShowModal] = useState(false);
    const [showTXInfoModal, setShowTXInfoModal] = useState(false);
    const [showTokenSelectionModal, setShowTokenSelectionModal] =
        useState(false);
    const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);
    const [selectedPair, setSelectedPair] = useState<Pair | null>(null);
    const [hasLoadedDefaultTokens, setHasLoadedDefaultTokens] = useState(false);
    const [hasLoadedDefaultPair, setHasLoadedDefaultPair] = useState(false);
    const chainId = useChainId();

    const selectedTokens = useMemo(
        () => [selectedToken, null],
        [selectedToken],
    );

    const { data: tokenLists = [] } = useGetTokenLists({});
    const moni = useMemo(() => __MONI__[chainId], [chainId]);
    const useAllPoolsQuery = useAllPools();
    const { data: poolsList = [], refetch: refetchPoolsList } =
        useAllPoolsQuery();

    const token0 = useMemo(
        () =>
            tokenLists.find(
                (token) =>
                    token.address.toLowerCase() ===
                    selectedPair?.token0.id.toLowerCase(),
            ),
        [tokenLists, selectedPair?.token0],
    );
    const token1 = useMemo(
        () =>
            tokenLists.find(
                (token) =>
                    token.address.toLowerCase() ===
                    selectedPair?.token1.id.toLowerCase(),
            ),
        [tokenLists, selectedPair?.token1],
    );

    const { balance: tokenBalance } = useERC20Balance(
        selectedToken?.address as any,
    );
    const { balance: nativeBalance } = useNativeBalance();
    const tBalance = useMemo(
        () =>
            selectedToken?.address.toLowerCase() === __ETHER__.toLowerCase()
                ? nativeBalance
                : tokenBalance,
        [selectedToken?.address, nativeBalance, tokenBalance],
    );

    const { usePoolFee } = useProtocolCore();
    const { data: fee } = usePoolFee(
        selectedPair?.id as any,
        selectedPair?.stable || false,
    );
    const { usePoolTotalSupply } = usePoolMetadata(selectedPair?.id as any);
    const { data: poolTotalSupply, refetch: refetchPoolSupply } =
        usePoolTotalSupply();
    const { balance: position } = useERC20Balance(selectedPair?.id as any);
    const formattedTS = useMemo(
        () => Number(formatUnits(poolTotalSupply ?? BigInt(1), 18)),
        [poolTotalSupply],
    );
    const positionRatio = useMemo(
        () => div(position, formattedTS),
        [formattedTS, position],
    );
    const token0Deposited = useMemo(
        () => positionRatio * Number(selectedPair?.reserve0 ?? "0"),
        [selectedPair?.reserve0, positionRatio],
    );
    const token1Deposited = useMemo(
        () => positionRatio * Number(selectedPair?.reserve1 ?? "0"),
        [selectedPair?.reserve1, positionRatio],
    );

    const { useGetPoolGauge, useGetPoolWeight, useGetGaugeBribe } =
        useVoterCore();

    const { data: gaugeId = zeroAddress, refetch: refetchGaugeId } =
        useGetPoolGauge(selectedPair?.id as any);
    const { data: poolWeight = BigInt(0), refetch: refetchPoolWeight } =
        useGetPoolWeight(selectedPair?.id as any);
    const { useGaugeReadables } = useGaugeCore();
    const { useRewardRate } = useGaugeReadables(gaugeId);
    const { data: rewardRate = BigInt(0), refetch: refetchRewardRate } =
        useRewardRate();

    const { data: bribeId = zeroAddress, refetch: refetchBribeId } =
        useGetGaugeBribe(gaugeId);

    const { useAllowance, useApproval } = useERC20Allowance(
        selectedToken?.address as any,
    );
    const { data: allowance = BigInt(0), refetch: refetchAllowance } =
        useAllowance(bribeId as any);
    const { executeApproval, isPending: approvalPending } = useApproval(
        bribeId as any,
        Number(parseUnits(amount.toString(), selectedToken?.decimals ?? 18)),
    );
    const allowedToSpend = useMemo(
        () => Number(formatUnits(allowance, selectedToken?.decimals ?? 18)),
        [allowance],
    );

    const { useRewardsExecutions } = useRewardsCore();
    const {
        notifyRewardAmount,
        isError: notifyRewardError,
        isPending: notifyRewardPending,
        isSuccess: notifyRewardSuccess,
        hash: notifyRewardHash,
        reset: resetNotifyReward,
    } = useRewardsExecutions(bribeId, () => setShowTXInfoModal(true));

    const { balance: availableIncentives } = useERC20BalanceOfOther(
        selectedToken?.address as any,
        bribeId,
    );

    const { isConnected } = useAccount();

    useWatchBlocks({
        onBlock: async () => {
            await refetchPoolsList();
            await refetchGaugeId();
            await refetchRewardRate();
            await refetchPoolWeight();
            await refetchBribeId();
            await refetchAllowance();
        },
    });

    useEffect(() => {
        if (!hasLoadedDefaultTokens) {
            if (tokenLists.length) {
                const MONI = tokenLists.find(
                    (token) =>
                        token.address.toLowerCase() === moni.toLowerCase(),
                );
                if (selectedToken === null) {
                    setSelectedToken(MONI as any);
                }
                setHasLoadedDefaultTokens(true);
            }
        }
    }, [moni, hasLoadedDefaultTokens, tokenLists, selectedToken]);

    useEffect(() => {
        if (!hasLoadedDefaultPair) {
            if (poolsList.length) {
                if (selectedPair === null) {
                    setSelectedPair(poolsList[0]);
                }
                setHasLoadedDefaultPair(true);
            }
        }
    }, [poolsList, hasLoadedDefaultPair, selectedPair]);

    return (
        <div className="p-5 pb-20">
            <Image
                src={BEAR1}
                alt="bear"
                className="absolute left-[50%] top-0 translate-x-[-50%]"
                width={350}
            />

            <div className="z-1 relative m-auto mt-32 flex max-w-[620px] flex-col gap-10">
                <div className="flex flex-col gap-7 bg-footer p-5 md:p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <Image
                                    src={token0?.logoURI ?? ""}
                                    alt="icon"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                                <Image
                                    src={token1?.logoURI ?? ""}
                                    alt="icon"
                                    width={30}
                                    height={30}
                                    className="-translate-x-3 rounded-full"
                                />
                            </div>

                            <div>
                                <span>
                                    {selectedPair?.stable ? "sAMM" : "vAMM"}-
                                    {selectedPair?.token0.symbol}/
                                    {selectedPair?.token1.symbol}
                                </span>
                                <ChipBadge>
                                    Basic{" "}
                                    {selectedPair?.stable
                                        ? "Stable"
                                        : "Volatile"}{" "}
                                    ·{Number(fee ?? 0) / 100}%
                                </ChipBadge>
                            </div>
                        </div>

                        <div
                            className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full bg-darkgray"
                            onClick={() => setShowModal(true)}
                        >
                            <ChevronDown size={20} />
                        </div>
                    </div>

                    <Divider className="bg-swapBox" />

                    <div className="flex w-full items-start justify-between gap-3">
                        <div className="flex flex-col items-start justify-start gap-2">
                            <span className="capitalize text-swapBox">
                                liquidity
                            </span>
                            <div className="flex flex-col items-start justify-start gap-1">
                                <div>
                                    <span className="text-swapBox">
                                        {!!selectedPair
                                            ? toSF(selectedPair.reserve0)
                                            : 0.0}
                                    </span>{" "}
                                    <span>{selectedPair?.token0.symbol}</span>
                                </div>

                                <div>
                                    <span className="text-swapBox">
                                        {!!selectedPair
                                            ? toSF(selectedPair.reserve1)
                                            : 0.0}
                                    </span>{" "}
                                    <span>{selectedPair?.token1.symbol}</span>
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
                                        {!!selectedPair
                                            ? toSF(token0Deposited)
                                            : 0.0}
                                    </span>{" "}
                                    <span>{selectedPair?.token0.symbol}</span>
                                </div>

                                <div>
                                    <span className="text-swapBox">
                                        {!!selectedPair
                                            ? toSF(token1Deposited)
                                            : 0.0}
                                    </span>{" "}
                                    <span>{selectedPair?.token1.symbol}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Divider className="bg-swapBox" />

                    <div className="flex flex-col gap-2 text-navDefault">
                        <div className="flex flex-wrap justify-between">
                            <div className="w-[50%] space-y-2 sm:w-fit">
                                <p>APR</p>
                                <p className="text-white">
                                    {Number(rewardRate)}%
                                </p>
                            </div>
                            <div className="w-[50%] space-y-2 sm:w-fit">
                                <p>Current Vote</p>
                                <p className="text-white">
                                    {toSF(formatUnits(poolWeight, 18))}
                                </p>
                            </div>
                            <div className="mt-7 w-full space-y-2 sm:mt-0 sm:w-fit sm:text-right">
                                <p>Current Incentives</p>
                                <p className="text-white">
                                    {toSF(availableIncentives)}{" "}
                                    {selectedToken?.symbol}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Divider className="bg-swapBox" />

                    <div>
                        <div className="flex justify-between">
                            <p>Your Incentives</p>
                            <p>
                                Available {tBalance.toFixed(3)}{" "}
                                {selectedToken?.symbol}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="flex h-[50px] flex-[2_2_0%] cursor-pointer items-center justify-between border-b border-l border-t border-swapBox bg-btn-black px-3"
                            onClick={() => setShowTokenSelectionModal(true)}
                        >
                            {selectedToken && (
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={selectedToken.logoURI}
                                        alt={selectedToken.name}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                    <span>{selectedToken.symbol}</span>
                                </div>
                            )}

                            <ChevronDown />
                        </button>

                        <div className="flex h-[50px] flex-[3_3_0%] items-center justify-between border border-swapBox bg-btn-black p-3">
                            <Input
                                value={amount.toString()}
                                type="number"
                                onChange={(ev) =>
                                    setAmount(Number(ev.target.value))
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
                </div>

                {isConnected ? (
                    <>
                        {allowedToSpend >= amount ? (
                            <Button
                                onClick={() =>
                                    notifyRewardAmount(
                                        selectedToken?.address as string,
                                        parseUnits(
                                            amount.toString(),
                                            selectedToken?.decimals as number,
                                        ),
                                    )
                                }
                                disabled={notifyRewardPending || amount <= 0}
                                isLoading={notifyRewardPending}
                                variant="primary"
                                className="w-full capitalize"
                            >
                                add incentives
                            </Button>
                        ) : (
                            <Button
                                onClick={executeApproval}
                                disabled={approvalPending}
                                isLoading={approvalPending}
                                variant="primary"
                                className="w-full capitalize"
                            >
                                allow {selectedToken?.symbol}
                            </Button>
                        )}
                    </>
                ) : (
                    <ConnectButton className="w-full" />
                )}
            </div>

            <IncentiveSelectModal
                isOpen={showModal}
                close={() => setShowModal(false)}
                poolsList={poolsList}
                selectedPair={selectedPair}
                tokenlist={tokenLists}
                onItemClick={(pair) => {
                    setSelectedPair(pair);
                    setShowModal(false);
                }}
            />

            <TokenSelectModal
                isOpen={showTokenSelectionModal}
                selectedTokens={selectedTokens as [TokenType, TokenType]}
                close={() => setShowTokenSelectionModal(false)}
                tokenLists={tokenLists}
                onItemClick={(t) => setSelectedToken(t)}
            />

            <TransactionInfoModal
                isOpen={showTXInfoModal}
                close={() => {
                    setShowTXInfoModal(false);
                    resetNotifyReward();
                }}
                type={
                    notifyRewardSuccess
                        ? "success"
                        : notifyRewardError
                          ? "failure"
                          : "failure"
                }
                txHash={notifyRewardHash}
            />
        </div>
    );
}
