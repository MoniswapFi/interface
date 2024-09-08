import CheckIcon from "@/assets/images/check.svg";
import { TransactionInfoModal } from "@/components/Modal";
import { AccountPosition } from "@/graphclient";
import { useGetTokenLists } from "@/hooks/api/tokens";
import {
    usePoolExecutions,
    usePoolMetadata,
    useProtocolCore,
} from "@/hooks/onchain/core";
import { useGaugeCore } from "@/hooks/onchain/gauge";
import { useVoterCore } from "@/hooks/onchain/voting";
import { Divider } from "@nextui-org/react";
import Image from "next/image";
import { FC, useMemo, useState } from "react";
import { formatUnits, zeroAddress } from "viem";
import { useWatchBlocks } from "wagmi";

type LPRewardProps = {
    data: AccountPosition;
};

export const LiquidityReward: FC<LPRewardProps> = ({ data }) => {
    const { data: tokenlist = [] } = useGetTokenLists();
    const [showTXInfoModal, setShowTXInfoModal] = useState(false);
    const token0 = useMemo(
        () =>
            tokenlist.find(
                (token) =>
                    token.address.toLowerCase() ===
                    data.pair.token0.id.toLowerCase(),
            ),
        [tokenlist, data.pair.token0.id],
    );
    const token1 = useMemo(
        () =>
            tokenlist.find(
                (token) =>
                    token.address.toLowerCase() ===
                    data.pair.token1.id.toLowerCase(),
            ),
        [tokenlist, data.pair.token1.id],
    );

    const { usePoolSymbol, useClaimable0, useClaimable1 } = usePoolMetadata(
        data.pair.id as any,
    );
    const { usePoolFee } = useProtocolCore();
    const { data: poolSymbol } = usePoolSymbol();
    const { data: fee } = usePoolFee(data.pair.id as any, data.pair.stable);

    const { data: claimable0 = BigInt(0), refetch: refetchClaimable0 } =
        useClaimable0();
    const { data: claimable1 = BigInt(0), refetch: refetchClaimable1 } =
        useClaimable1();

    const { useGetPoolGauge } = useVoterCore();
    const { data: gaugeId = zeroAddress, refetch: refetchGaugeId } =
        useGetPoolGauge(data.pair.id);
    const { useGaugeExecutions, useGaugeReadables } = useGaugeCore();
    const { useEarned, useRewardRate } = useGaugeReadables(gaugeId);
    const {
        getReward,
        isPending: getRewardPending,
        isSuccess: getRewardSuccess,
        isError: getRewardErrored,
        hash: getRewardHash,
        reset: resetGetReward,
    } = useGaugeExecutions(gaugeId, () => setShowTXInfoModal(true));
    const { data: earned = BigInt(0), refetch: refetchEarned } = useEarned();
    const { data: rewardRate = BigInt(0), refetch: refetchRewardRate } =
        useRewardRate();

    const { useClaimFees } = usePoolExecutions(data.pair.id);
    const {
        executeClaimFees,
        isPending: executeClaimFeesPending,
        isSuccess: executeClaimFeesSuccess,
        isError: executeClaimFeesErrored,
        hash: executeClaimFeesHash,
        reset: resetExecuteClaimFees,
    } = useClaimFees(() => setShowTXInfoModal(true));

    useWatchBlocks({
        onBlock: async () => {
            await refetchClaimable0();
            await refetchClaimable1();
            await refetchGaugeId();
            await refetchEarned();
            await refetchRewardRate();
        },
    });

    return (
        <div>
            <div className="flex flex-col justify-between gap-5 bg-footer p-5 lg:flex-row lg:gap-0">
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
                            Basic {data.pair.stable ? "Stable" : "Volatile"} ·
                            {Number(fee ?? 0) / 100}%
                        </p>
                    </div>
                </div>

                <Divider className="bg-swapBox lg:hidden" />

                <div className="lg:text-right">
                    <p className="text-textgray">Emissions APR</p>
                    <p>{Number(rewardRate)}%</p>
                </div>
                <Divider className="bg-swapBox lg:hidden" />

                <div className="flex flex-col justify-between gap-5 lg:items-end">
                    <div className="lg:text-right">
                        <p className="text-textgray">Reward Earned</p>
                        <p>
                            {Number(formatUnits(earned, 18)).toLocaleString(
                                "en-US",
                                { maximumFractionDigits: 5, useGrouping: true },
                            )}{" "}
                            <span className="text-textgray">MONI</span>
                        </p>
                    </div>

                    <button
                        onClick={getReward}
                        disabled={getRewardPending || earned === BigInt(0)}
                        className="flex cursor-pointer items-center gap-2 text-btn-primary lg:justify-end"
                    >
                        <Image alt="check icon" src={CheckIcon} />
                        <span>CLAIM</span>
                    </button>
                </div>
                <Divider className="bg-swapBox lg:hidden" />

                <div className="flex flex-col justify-between gap-5 lg:items-end">
                    <div className="lg:text-right">
                        <p className="text-textgray">Claimable Fees</p>
                        <p>
                            {Number(
                                formatUnits(
                                    claimable0,
                                    Number(data.pair.token0.decimals),
                                ),
                            ).toLocaleString("en-US", {
                                maximumFractionDigits: 5,
                                useGrouping: true,
                            })}{" "}
                            <span className="text-textgray">
                                {data.pair.token0.symbol}
                            </span>
                        </p>
                        <p>
                            {Number(
                                formatUnits(
                                    claimable1,
                                    Number(data.pair.token1.decimals),
                                ),
                            ).toLocaleString("en-US", {
                                maximumFractionDigits: 5,
                                useGrouping: true,
                            })}{" "}
                            <span className="text-textgray">
                                {data.pair.token1.symbol}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={executeClaimFees}
                        disabled={
                            executeClaimFeesPending ||
                            (claimable0 === BigInt(0) &&
                                claimable1 === BigInt(0))
                        }
                        className="flex cursor-pointer items-center gap-2 text-btn-primary lg:justify-end"
                    >
                        <Image alt="check icon" src={CheckIcon} />
                        <span>CLAIM</span>
                    </button>
                </div>
            </div>
            <TransactionInfoModal
                isOpen={showTXInfoModal}
                close={() => {
                    setShowTXInfoModal(false);
                    if (typeof getRewardHash !== "undefined") {
                        resetGetReward();
                    }

                    if (typeof executeClaimFeesHash !== "undefined") {
                        resetExecuteClaimFees();
                    }
                }}
                type={
                    getRewardSuccess || executeClaimFeesSuccess
                        ? "success"
                        : getRewardErrored || executeClaimFeesErrored
                          ? "failure"
                          : "failure"
                }
                txHash={getRewardHash ?? executeClaimFeesHash}
            />
        </div>
    );
};
