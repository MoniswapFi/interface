import { rewardsAbi, voterAbi } from "@/assets/abis";
import CheckIcon from "@/assets/images/check.svg";
import { TransactionInfoModal } from "@/components/Modal";
import { ChipBadge } from "@/components/ui/chipBadge";
import { __MULTICALL__, __VOTER__ } from "@/config/constants";
import type { VotePosition } from "@/graphclient";
import { useGetTokenLists } from "@/hooks/api/tokens";
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { useEscrowCore } from "@/hooks/onchain/escrow";
import { useMulticall } from "@/hooks/onchain/multicall";
import { useRewardsCore } from "@/hooks/onchain/rewards";
import { useVoterCore } from "@/hooks/onchain/voting";
import { TokenType } from "@/types";
import { callToBytes, resultFromBytes } from "@/utils/bytes";
import { toSF } from "@/utils/format";
import { call } from "@wagmi/core";
import Image from "next/image";
import { FC, useEffect, useMemo, useState } from "react";
import { formatUnits, zeroAddress } from "viem";
import { useAccount, useChainId, useConfig, useWatchBlocks } from "wagmi";

type VotingRewardProps = {
    data: VotePosition;
};

type FeeOrIncentiveProps = {
    contractAddress: string;
    tokenPosition: number;
    tokenlist: TokenType[];
    lockId: number;
    _type: "INCENTIVES" | "FEE";
};

export const FeeOrIncentiveComponent: FC<FeeOrIncentiveProps> = ({
    contractAddress,
    tokenPosition,
    tokenlist,
    lockId,
    _type,
}) => {
    const { useRewardsReadables } = useRewardsCore();
    const { useRewardToken, useEarned } = useRewardsReadables(contractAddress);
    const { data: tokenAddress = zeroAddress } = useRewardToken(tokenPosition);
    const { data: earned = BigInt(0) } = useEarned(tokenAddress, lockId);
    const token = useMemo(
        () =>
            tokenlist.find(
                (tokenType) =>
                    tokenType.address.toLowerCase() ===
                    tokenAddress.toLowerCase(),
            ),
        [tokenlist, tokenAddress],
    );
    return (
        <div className="flex items-center justify-between gap-3 lg:justify-end">
            <div className="flex items-center gap-3">
                <Image
                    src={token?.logoURI || ""}
                    alt="icon"
                    width={30}
                    height={30}
                    className="rounded-full"
                />
                {Number(
                    formatUnits(earned, token?.decimals ?? 18),
                ).toLocaleString("en-US", {
                    maximumFractionDigits: 5,
                    useGrouping: true,
                })}{" "}
                <span className="text-textgray">{token?.symbol}</span>
            </div>
            <ChipBadge>
                <span>{_type}</span>
            </ChipBadge>
        </div>
    );
};

export const VotingReward: FC<VotingRewardProps> = ({ data }) => {
    const { data: tokenlist = [] } = useGetTokenLists();
    const [showTXInfoModal, setShowTXInfoModal] = useState(false);
    const token0 = useMemo(
        () =>
            tokenlist.find(
                (token) =>
                    token.address.toLowerCase() ===
                    data.pair?.token0.id.toLowerCase(),
            ),
        [tokenlist, data.pair?.token0.id],
    );
    const token1 = useMemo(
        () =>
            tokenlist.find(
                (token) =>
                    token.address.toLowerCase() ===
                    data.pair?.token1.id.toLowerCase(),
            ),
        [tokenlist, data.pair?.token1.id],
    );

    const { usePoolSymbol, usePoolStability } = usePoolMetadata(
        data.pair?.id as any,
    );
    const { usePoolFee } = useProtocolCore();
    const { data: stable = false } = usePoolStability();
    const { data: poolSymbol } = usePoolSymbol();
    const { data: fee } = usePoolFee(data.pair?.id as any, stable);

    const { useEscrowReadables, useEscrowExecutions } = useEscrowCore();
    const { useLocked, useIsApprovedOrOwner } = useEscrowReadables();
    const {
        data: locked = {
            amount: BigInt(0),
            end: BigInt(0),
            isPermanent: false,
        },
        refetch: refetchLocked,
    } = useLocked(Number(data.lockId));

    const {
        useGetPoolGauge,
        useGetGaugeFees,
        useGetGaugeBribe,
        useLockVoteWeightForPool,
    } = useVoterCore();
    const { data: gaugeId = zeroAddress, refetch: refetchGaugeId } =
        useGetPoolGauge(data.pair?.id || zeroAddress);
    const { data: feesId = zeroAddress, refetch: refetchFeesId } =
        useGetGaugeFees(gaugeId);
    const { data: bribesId = zeroAddress, refetch: refetchBribesId } =
        useGetGaugeBribe(gaugeId);
    const { useRewardsReadables } = useRewardsCore();
    const { useRewardsListLength: useRewardsListLengthFees } =
        useRewardsReadables(feesId);
    const { useRewardsListLength: useRewardsListLengthBribes } =
        useRewardsReadables(bribesId);
    const {
        data: feesRewardsLength = BigInt(0),
        refetch: refetchFeesRewardsLength,
    } = useRewardsListLengthFees();
    const {
        data: bribesRewardsLength = BigInt(0),
        refetch: refetchBribesRewardsLength,
    } = useRewardsListLengthBribes();

    const [feesTokens, setFeesTokens] = useState<string[]>([]);
    const [bribesTokens, setBribesTokens] = useState<string[]>([]);
    const { data: allocatedWeight = BigInt(0) } = useLockVoteWeightForPool(
        Number(data.lockId),
        data.pair?.id as any,
    );
    const voteClaimBytes = useMemo(
        () => [
            callToBytes(voterAbi, "claimFees", [
                [feesId],
                [feesTokens],
                BigInt(Number(data.lockId)),
            ]),
            callToBytes(voterAbi, "claimBribes", [
                [bribesId],
                [bribesTokens],
                BigInt(Number(data.lockId)),
            ]),
        ],
        [feesId, feesTokens, data.lockId, bribesId, bribesTokens],
    );

    const chainId = useChainId();
    const { useRunMulticall } = useMulticall();
    const {
        executeMCall,
        isError: callError,
        isPending: callPending,
        isSuccess: callSuccess,
        hash: callHash,
        reset: resetCall,
    } = useRunMulticall(__VOTER__[chainId], voteClaimBytes, () =>
        setShowTXInfoModal(true),
    );

    const config = useConfig();
    const { address } = useAccount();

    const { data: isApprovedToSpendNFT, refetch: refetchApprovedOrOwner } =
        useIsApprovedOrOwner(__MULTICALL__[chainId], Number(data.lockId));
    const { approveToSpendNFT, isPending: approvalPending } =
        useEscrowExecutions();

    useEffect(() => {
        (async () => {
            const length = Number(feesRewardsLength);
            const tokens: string[] = [];

            for (let i = 0; i < length; i++) {
                const { data: resBytes = zeroAddress } = await call(config, {
                    data: callToBytes(rewardsAbi, "rewards", [BigInt(i)]),
                    to: feesId,
                    account: address,
                });

                const result = resultFromBytes<string>(
                    rewardsAbi,
                    "rewards",
                    resBytes,
                );
                tokens.push(result);
            }

            setFeesTokens(tokens);
        })();
    }, [feesRewardsLength, config, feesId, address]);

    useEffect(() => {
        (async () => {
            const length = Number(bribesRewardsLength);
            const tokens: string[] = [];

            for (let i = 0; i < length; i++) {
                const { data: resBytes = zeroAddress } = await call(config, {
                    data: callToBytes(rewardsAbi, "rewards", [BigInt(i)]),
                    to: bribesId,
                    account: address,
                });

                const result = resultFromBytes<string>(
                    rewardsAbi,
                    "rewards",
                    resBytes,
                );
                tokens.push(result);
            }

            setBribesTokens(tokens);
        })();
    }, [bribesRewardsLength, config, bribesId, address]);

    useWatchBlocks({
        onBlock: async () => {
            await refetchLocked();
            await refetchGaugeId();
            await refetchFeesId();
            await refetchBribesId();
            await refetchFeesRewardsLength();
            await refetchBribesRewardsLength();
            await refetchApprovedOrOwner();
        },
    });

    return (
        <div>
            <div className="flex flex-col justify-between gap-3 bg-footer p-5 lg:flex-row lg:gap-0">
                <div className="flex items-start">
                    <div className="flex items-center">
                        <Image
                            src={token0?.logoURI || ""}
                            alt="icon"
                            width={30}
                            height={30}
                            className="rounded-full"
                        />
                        <Image
                            src={token1?.logoURI || ""}
                            alt="icon"
                            width={30}
                            height={30}
                            className="-translate-x-3 rounded-full"
                        />
                    </div>

                    <div>
                        <p>{poolSymbol}</p>
                        <p className="bg-darkgray px-2 py-1 text-xs text-lightblue">
                            Basic {stable ? "Stable" : "Volatile"} ·
                            {Number(fee ?? 0) / 100}%
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-between gap-5 lg:items-end">
                    <div className="lg:text-right">
                        <p className="text-textgray">Lock #{data.lockId}</p>
                        <p>
                            {toSF(formatUnits(BigInt(locked.amount), 18))}{" "}
                            <span className="text-textgray">MONI locked</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col justify-between gap-5 lg:items-end">
                    <div className="lg:text-right">
                        <p className="text-textgray">Allocated weight</p>
                        <p>
                            {toSF(formatUnits(allocatedWeight, 18))}{" "}
                            <span className="text-textgray">veMONI</span>
                        </p>
                    </div>
                </div>

                <div className="flex min-w-0 flex-col justify-between gap-5 lg:items-end">
                    <div className="flex flex-col gap-3">
                        <p className="text-textgray lg:text-right">Rewards</p>
                        {Array.from(
                            { length: Number(feesRewardsLength) },
                            (_, i) => i,
                        ).map((val) => (
                            <FeeOrIncentiveComponent
                                key={val}
                                tokenPosition={val}
                                tokenlist={tokenlist}
                                contractAddress={feesId}
                                _type="FEE"
                                lockId={Number(data.lockId)}
                            />
                        ))}
                        {Array.from(
                            { length: Number(bribesRewardsLength) },
                            (_, i) => i,
                        ).map((val) => (
                            <FeeOrIncentiveComponent
                                key={val}
                                tokenPosition={val}
                                tokenlist={tokenlist}
                                contractAddress={bribesId}
                                _type="INCENTIVES"
                                lockId={Number(data.lockId)}
                            />
                        ))}
                    </div>
                    {isApprovedToSpendNFT ? (
                        <button
                            onClick={executeMCall}
                            disabled={callPending}
                            className="flex cursor-pointer items-center gap-2 text-btn-primary lg:justify-end"
                        >
                            <Image alt="check icon" src={CheckIcon} />
                            <span>CLAIM</span>
                        </button>
                    ) : (
                        <button
                            onClick={() =>
                                approveToSpendNFT(
                                    __MULTICALL__[chainId],
                                    Number(data.lockId),
                                )
                            }
                            disabled={approvalPending}
                            className="flex cursor-pointer items-center gap-2 text-btn-primary lg:justify-end"
                        >
                            <Image alt="check icon" src={CheckIcon} />
                            <span>ALLOW LOCK {data.lockId}</span>
                        </button>
                    )}
                </div>
            </div>

            <TransactionInfoModal
                isOpen={showTXInfoModal}
                close={() => {
                    resetCall();
                }}
                type={
                    callSuccess ? "success" : callError ? "failure" : "failure"
                }
                txHash={callHash}
            />
        </div>
    );
};
