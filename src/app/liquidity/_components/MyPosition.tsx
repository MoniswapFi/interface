"use client";

import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/Popover";
import { PoolTypes } from "@/config/constants";
import { type AccountPosition } from "@/graphclient";
import { useGetTokenLists } from "@/hooks/api/tokens";
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { useERC20Balance } from "@/hooks/onchain/wallet";
import { div } from "@/utils/math";
import { Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";
import { formatUnits } from "viem";
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

    useWatchBlocks({
        onBlock: async () => {
            await refetchPoolSupply();
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
                    TVL <Popover content="Total volume locked." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                    <span>
                        $
                        {Number(data.pair.reserveUSD).toLocaleString("en-US", {
                            maximumFractionDigits: 3,
                            useGrouping: true,
                        })}
                    </span>
                    <span className="text-textgray">
                        {Number(data.pair.reserve0).toLocaleString("en-US", {
                            maximumFractionDigits: 3,
                            useGrouping: true,
                        })}{" "}
                        {data.pair.token0.symbol}
                    </span>
                    <span className="text-textgray">
                        {Number(data.pair.reserve1).toLocaleString("en-US", {
                            maximumFractionDigits: 3,
                            useGrouping: true,
                        })}{" "}
                        {data.pair.token1.symbol}
                    </span>
                </div>
            </div>
            <div className="flex justify-between pb-5 lg:block lg:w-[80px] lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                    {"APR"} <Popover content="Popover content here." />
                </span>
                0.00%
            </div>
            <div className="flex justify-between border-b border-swapBox pb-5 lg:block lg:w-[130px] lg:border-none lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                    {"Your Deposits"} <Popover content="Tokens deposited." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                    <span>
                        $
                        {(
                            Number(data.pair.token0.derivedUSD) *
                                token0Deposited +
                            Number(data.pair.token1.derivedUSD) *
                                token1Deposited
                        ).toLocaleString("en-US", {
                            maximumFractionDigits: 3,
                            useGrouping: true,
                        })}
                    </span>
                    <span className="text-textgray">
                        {" "}
                        {Number(token0Deposited).toLocaleString("en-US", {
                            maximumFractionDigits: 3,
                            useGrouping: true,
                        })}{" "}
                        {data.pair.token0.symbol}
                    </span>
                    <span className="text-textgray">
                        {Number(token1Deposited).toLocaleString("en-US", {
                            maximumFractionDigits: 3,
                            useGrouping: true,
                        })}{" "}
                        {data.pair.token1.symbol}
                    </span>
                </div>
            </div>
            <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
                <span className="text-textgray lg:hidden">
                    {"Staked"} <Popover content="Popover content here." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                    <span>$2,352.53</span>
                    <span className="text-textgray">0.00 BERA</span>
                    <span className="text-textgray">0.00 MONI</span>
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
                    TVL <Popover content="Total volume locked." />
                </div>
                <div className="hidden w-[80px] text-right lg:block">
                    {"APR"}
                </div>
                <div className="hidden w-[150px] text-right lg:block">
                    {"Your Deposits"} <Popover content="Amounts Deposited." />
                </div>
                <div className="hidden w-[130px] text-right lg:block">
                    {"Staked"} <Popover content="Value staked." />
                </div>
                <div className="hidden w-[150px] text-right lg:block">
                    {"Action"}
                </div>
            </div>

            {data.map((item, index) => {
                return <Position data={item} key={index} />;
            })}
        </>
    );
};
