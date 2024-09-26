import { Popover } from "@/components/ui/Popover";
import { Button } from "@/components/ui/button";
import { Pair } from "@/graphclient";
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { useGaugeCore } from "@/hooks/onchain/gauge";
import { useVoterCore } from "@/hooks/onchain/voting";
import { useERC20Balance } from "@/hooks/onchain/wallet";
import { RootState } from "@/store";
import {
    deselectPoolFromVoting,
    selectPoolForVoting,
} from "@/store/slices/voting";
import { TokenType } from "@/types";
import { toSF } from "@/utils/format";
import { div } from "@/utils/math";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { FC, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatUnits, zeroAddress } from "viem";
import { useWatchBlocks } from "wagmi";

type PoolProps = {
    data: Pair;
    tokenlist: TokenType[];
};

export const Pool: FC<PoolProps> = ({ data, tokenlist }) => {
    const { useGetPoolGauge, useGaugeClaimable } = useVoterCore();

    const { data: gaugeId = zeroAddress, refetch: refetchGaugeId } =
        useGetPoolGauge(data.id);
    const { useGaugeReadables } = useGaugeCore();
    const { useRewardRate, useBalanceOf } = useGaugeReadables(gaugeId);
    const { data: rewardRate = BigInt(0), refetch: refetchRewardRate } =
        useRewardRate();
    const { data: gaugeClaimable = BigInt(0), refetch: refetchGaugeClaimable } =
        useGaugeClaimable(gaugeId);

    const { useStableFee, useVolatileFee } = useProtocolCore();
    const { data: stableFee } = useStableFee();
    const { data: volatileFee } = useVolatileFee();
    const { balance: position } = useERC20Balance(data.id as any);
    const { usePoolTotalSupply } = usePoolMetadata(data.id as any);
    const { data: poolTotalSupply, refetch: refetchPoolSupply } =
        usePoolTotalSupply();
    const formattedTS = useMemo(
        () => Number(formatUnits(poolTotalSupply ?? BigInt(1), 18)),
        [poolTotalSupply],
    );
    const positionRatio = useMemo(
        () => div(position, formattedTS),
        [formattedTS, position],
    );
    const token0Deposited = useMemo(
        () => positionRatio * Number(data.reserve0 ?? "0"),
        [data.reserve0, positionRatio],
    );
    const token1Deposited = useMemo(
        () => positionRatio * Number(data.reserve1 ?? "0"),
        [data.reserve1, positionRatio],
    );
    const { data: balanceInGauge = BigInt(0), refetch: refetchBalanceOf } =
        useBalanceOf();
    const formattedBalanceInGauge = useMemo(
        () => Number(formatUnits(balanceInGauge, 18)),
        [balanceInGauge],
    );
    const gaugePositionRatio = useMemo(
        () => div(formattedBalanceInGauge, formattedTS),
        [formattedTS, formattedBalanceInGauge],
    );
    const token0AmountInGauge = useMemo(
        () => gaugePositionRatio * Number(data.reserve0 ?? "0"),
        [data.reserve0, gaugePositionRatio],
    );
    const token1AmountInGauge = useMemo(
        () => gaugePositionRatio * Number(data.reserve1 ?? "0"),
        [data.reserve1, gaugePositionRatio],
    );

    const token0 = useMemo(
        () =>
            tokenlist.find(
                (token) =>
                    token.address.toLowerCase() ===
                    data.token0.id.toLowerCase(),
            ),
        [tokenlist, data.token0],
    );
    const token1 = useMemo(
        () =>
            tokenlist.find(
                (token) =>
                    token.address.toLowerCase() ===
                    data.token1.id.toLowerCase(),
            ),
        [tokenlist, data.token1],
    );

    const { weight, selectedPools, weights } = useSelector(
        (state: RootState) => state.voting,
    );
    const totalSelectedWeights = useMemo(
        () => weights.reduce((prev, curr) => prev + curr, 0),
        [weights],
    );
    const dispatch = useDispatch();

    useWatchBlocks({
        onBlock: async () => {
            await refetchPoolSupply();
            await refetchBalanceOf();
            await refetchGaugeId();
            await refetchRewardRate();
            await refetchGaugeClaimable();
        },
    });
    return (
        <div className="flex flex-col justify-between gap-3 border-t border-swapBox pt-5 lg:flex-row lg:items-center lg:gap-0">
            <div className="flex lg:w-[25%]">
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
                <div className="flex flex-col">
                    <span className="text-sm">
                        {data.stable ? "sAMM" : "vAMM"}-{data.token0.symbol}/
                        {data.token1.symbol}
                    </span>
                    <span className="bg-darkgray p-1 text-xs text-lightblue">
                        Basic {data.stable ? "Stable" : "Volatile"} •{" "}
                        {Number((data.stable ? stableFee : volatileFee) ?? 0) /
                            100}
                        %
                    </span>
                </div>
            </div>

            <div className="flex justify-between pb-5 lg:block lg:w-[150px] lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                    TVL <Popover content="Popover content here." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                    <span>${toSF(data.reserveUSD)}</span>
                </div>
            </div>
            <div className="flex justify-between pb-5 lg:block lg:w-[150px] lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                    {"Fees"} <Popover content="Popover content here." />
                </span>
                <span>{Number(rewardRate)}%</span>
            </div>
            <div className="flex justify-between pb-5 lg:block lg:w-[150px] lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                    {"Your Deposits"}{" "}
                    <Popover content="Popover content here." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                    <span>
                        $
                        {toSF(
                            Number(data.token0.derivedUSD) * token0Deposited +
                                Number(data.token1.derivedUSD) *
                                    token1Deposited,
                        )}
                    </span>
                </div>
            </div>
            <div className="flex justify-between pb-5 lg:block lg:w-[150px] lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                    {"Total Reward"} <Popover content="Popover content here." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                    <span>{toSF(formatUnits(gaugeClaimable, 18))} MONI</span>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2 lg:block lg:w-[70px] lg:text-right">
                <div className="flex justify-between pb-5 lg:block lg:pb-0">
                    <span className="text-textgray lg:hidden">vAPR</span>
                    <span>
                        {toSF(
                            ((weight[data.id] ? weight[data.id] : 0) /
                                (totalSelectedWeights === 0
                                    ? 1
                                    : totalSelectedWeights)) *
                                100,
                        )}
                        %
                    </span>
                </div>
                <Button
                    onClick={() =>
                        selectedPools.includes(data.id)
                            ? dispatch(deselectPoolFromVoting(data.id))
                            : dispatch(selectPoolForVoting([data.id, 0]))
                    }
                    className="w-full text-sm lg:w-fit lg:min-w-0"
                    variant={
                        selectedPools.includes(data.id) ? "faded" : "secondary"
                    }
                >
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <span className="text-btn-primary lg:hidden">
                        {selectedPools.includes(data.id)
                            ? "Deselect"
                            : "Select"}
                    </span>
                </Button>
            </div>
        </div>
    );
};
