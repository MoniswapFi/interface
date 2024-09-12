"use client";

import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/Popover";
import {
    FAQ_APR,
    FAQ_STAKED,
    FAQ_TVL,
    FAQ_YOUR_DEPOSIT,
    PoolTypes,
} from "@/config/constants";
import { type AccountPosition } from "@/graphclient";
import { useGetTokenLists } from "@/hooks/api/tokens";
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { useGaugeCore } from "@/hooks/onchain/gauge";
import { useVoterCore } from "@/hooks/onchain/voting";
import { useERC20Balance } from "@/hooks/onchain/wallet";
import { toSF } from "@/utils/format";
import { div } from "@/utils/math";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";
import { formatUnits, zeroAddress } from "viem";
import { useWatchBlocks } from "wagmi";

type AccountPositionProps = {
    data: AccountPosition[];
};

type SinglePositionProps = {
    data: AccountPosition;
};

const Position: FC<SinglePositionProps> = ({ data }) => {
    const { push } = useRouter();

    const { data: tokenlist = [] } = useGetTokenLists({});
    const { useStableFee, useVolatileFee } = useProtocolCore();
    const { data: stableFee } = useStableFee();
    const { data: volatileFee } = useVolatileFee();

    const { balance: position } = useERC20Balance(data.pair.id as any);
    const { usePoolTotalSupply } = usePoolMetadata(data.pair.id as any);
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
        () => positionRatio * Number(data.pair.reserve0 ?? "0"),
        [data.pair.reserve0, positionRatio],
    );
    const token1Deposited = useMemo(
        () => positionRatio * Number(data.pair.reserve1 ?? "0"),
        [data.pair.reserve1, positionRatio],
    );

    const { useGetPoolGauge } = useVoterCore();

    const { data: gaugeId = zeroAddress, refetch: refetchGaugeId } =
        useGetPoolGauge(data.pair.id);
    const { useGaugeReadables } = useGaugeCore();
    const { useBalanceOf, useRewardRate } = useGaugeReadables(gaugeId);
    const { data: rate = BigInt(0), refetch: refetchRate } = useRewardRate();
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
        () => gaugePositionRatio * Number(data.pair.reserve0 ?? "0"),
        [data.pair.reserve0, gaugePositionRatio],
    );
    const token1AmountInGauge = useMemo(
        () => gaugePositionRatio * Number(data.pair.reserve1 ?? "0"),
        [data.pair.reserve1, gaugePositionRatio],
    );

    useWatchBlocks({
        onBlock: async () => {
            await refetchPoolSupply();
            await refetchGaugeId();
            await refetchBalanceOf();
            await refetchRate();
        },
    });

    return (
        <div className="flex flex-col justify-between gap-3 border-t border-swapBox pt-5 lg:flex-row lg:items-center lg:gap-0">
            <div className="flex lg:w-[25%]">
                <div className="flex items-center">
                    <Image
                        src={
                            tokenlist.find(
                                (tt) =>
                                    tt.address.toLowerCase() ===
                                    data.pair.token0.id.toLowerCase(),
                            )?.logoURI ?? ""
                        }
                        alt="icon"
                        width={30}
                        height={30}
                        className="rounded-full"
                    />
                    <Image
                        src={
                            tokenlist.find(
                                (tt) =>
                                    tt.address.toLowerCase() ===
                                    data.pair.token1.id.toLowerCase(),
                            )?.logoURI ?? ""
                        }
                        alt="icon"
                        width={30}
                        height={30}
                        className="-translate-x-3 rounded-full"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm">
                        {data.pair.stable ? "sAMM" : "vAMM"}-
                        {data.pair.token0.symbol}/{data.pair.token1.symbol}
                    </span>
                    <span className="bg-darkgray p-1 text-xs text-lightblue">
                        Basic {data.pair.stable ? "Stable" : "Volatile"} •{" "}
                        {Number(
                            (data.pair.stable ? stableFee : volatileFee) ?? 0,
                        ) / 100}
                        %
                    </span>
                </div>
            </div>

            <div className="flex justify-between border-b border-swapBox pb-5 lg:block lg:w-[150px] lg:border-none lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                    {FAQ_TVL.title}{" "}
                    <Popover content={`${FAQ_TVL.description}`} />
                </span>
                <div className="flex flex-col gap-3 text-right">
                    <span>${toSF(data.pair.reserveUSD)}</span>
                    <span className="text-textgray">
                        {toSF(data.pair.reserve0)} {data.pair.token0.symbol}
                    </span>
                    <span className="text-textgray">
                        {toSF(data.pair.reserve1)} {data.pair.token1.symbol}
                    </span>
                </div>
            </div>
            <div className="flex justify-between pb-5 lg:block lg:w-[80px] lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                    {"APR"} <Popover content="Deposit rate." />
                </span>
                {Number(rate)}%
            </div>
            <div className="flex justify-between border-b border-swapBox pb-5 lg:block lg:w-[130px] lg:border-none lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                    {"Your Deposits"} <Popover content="Tokens deposited." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                    <span>
                        $
                        {toSF(
                            Number(data.pair.token0.derivedUSD) *
                                token0Deposited +
                                Number(data.pair.token1.derivedUSD) *
                                    token1Deposited,
                        )}
                    </span>
                    <span className="text-textgray">
                        {" "}
                        {toSF(token0Deposited)} {data.pair.token0.symbol}
                    </span>
                    <span className="text-textgray">
                        {toSF(token1Deposited)} {data.pair.token1.symbol}
                    </span>
                </div>
            </div>
            <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
                <span className="text-textgray lg:hidden">
                    {"Staked"} <Popover content="Tokens deposited." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                    <span>
                        $
                        {toSF(
                            Number(data.pair.token0.derivedUSD) *
                                token0AmountInGauge +
                                Number(data.pair.token1.derivedUSD) *
                                    token1AmountInGauge,
                        )}
                    </span>
                    <span className="text-textgray">
                        {toSF(token0AmountInGauge)} {data.pair.token0.symbol}
                    </span>
                    <span className="text-textgray">
                        {toSF(token1AmountInGauge)} {data.pair.token1.symbol}
                    </span>
                </div>
            </div>
            <div className="flex w-full flex-col gap-2 lg:w-[150px]">
                <Button
                    onClick={() => push(`/liquidity/stake/${data.pair.id}`)}
                    className="w-full text-sm lg:min-w-0"
                    variant="primary"
                >
                    <span>Stake Deposit</span>
                </Button>
                <Button
                    onClick={() => push(`/liquidity/withdraw/${data.pair.id}`)}
                    className="w-full text-sm text-btn-primary lg:min-w-0"
                >
                    <span>Withdraw Deposit</span>
                </Button>
            </div>
        </div>
    );
};

export const MyPosition: FC<AccountPositionProps> = ({ data }) => {
    return (
        <>
            <div className="items-center justify-between lg:flex">
                <div className="lg:w-[25%]">
                    <Select
                        label="Select an animal"
                        classNames={{
                            trigger:
                                "bg-transparent data-[hover=true]:bg-transparent border border-btn-primary",
                            listbox: "bg-footer",
                            listboxWrapper: "bg-footer",
                            popoverContent:
                                "p-0 bg-footer border rounded-none border-btn-primary",
                            label: "hidden",
                            base: "!m-0",
                            value: "!text-white",
                        }}
                        radius="none"
                        defaultSelectedKeys={"all"}
                        labelPlacement="outside"
                    >
                        {PoolTypes.map((item, index) => {
                            return (
                                <SelectItem
                                    key={item.key}
                                    className="data-[hover=true]:border data-[hover=true]:border-btn-primary data-[hover=true]:bg-transparent data-[hover=true]:text-white"
                                >
                                    {item.text}
                                </SelectItem>
                            );
                        })}
                    </Select>
                </div>
                <div className="hidden w-[150px] text-right lg:block">
                    {FAQ_TVL.title}
                    <Popover content={`${FAQ_TVL.description}`} />
                </div>
                <div className="hidden w-[80px] text-right lg:block">
                    {FAQ_APR.title}
                    <Popover content={`${FAQ_APR.description}`} />
                </div>
                <div className="hidden w-[150px] text-right lg:block">
                    {FAQ_YOUR_DEPOSIT.title}{" "}
                    <Popover content={`${FAQ_YOUR_DEPOSIT.description}`} />
                </div>
                <div className="hidden w-[130px] text-right lg:block">
                    {FAQ_STAKED.title}{" "}
                    <Popover content={`${FAQ_STAKED.description}`} />{" "}
                </div>
                <div className="hidden w-[150px] text-right lg:block">
                    {"Action"}
                </div>
            </div>

            {data.length ? (
                data.map((item, index) => {
                    return <Position data={item} key={index} />;
                })
            ) : (
                <div className="flex w-full gap-3 bg-footer px-5 py-3 text-textgray md:items-center">
                    <span className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-textgray">
                        <FontAwesomeIcon icon={faInfo} size="xs" />
                    </span>
                    Your LP positions will appear here.
                </div>
            )}
        </>
    );
};
