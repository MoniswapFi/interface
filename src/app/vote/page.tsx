"use client";

import Bear4 from "@/assets/images/bear4.png";
import Image2 from "@/assets/images/image2.svg";
import Rectangle from "@/assets/images/Rectangle_t.svg";
import { Popover } from "@/components/ui/Popover";
import {
    FAQ_INCENTIVES,
    FAQ_TOTAL_REWARD,
    FAQ_TVL,
    PoolTypes,
} from "@/config/constants";
import { useGetTokenLists } from "@/hooks/api/tokens";
import { useAllPools } from "@/hooks/graphql/core";
import { useVoterCore } from "@/hooks/onchain/voting";
import { Divider, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { useMemo } from "react";
import { formatUnits } from "viem";
import { useBlockNumber, useWatchBlocks } from "wagmi";
import { Pool } from "./_components/Pool";

export default function Page() {
    const useAllPoolsQuery = useAllPools();
    const { data: pairs = [], refetch: refetchPairs } = useAllPoolsQuery();
    const { data: tokenlist = [] } = useGetTokenLists({});
    const { useTotalWeight, useEpochVoteEnd } = useVoterCore();
    const { data: totalWeight = BigInt(0) } = useTotalWeight();
    const { data: currentBlock = BigInt(0), refetch: refetchCurrentBlock } =
        useBlockNumber();
    const { data: voteEnd = BigInt(0), refetch: refetchEpochVoteEnd } =
        useEpochVoteEnd(Number(currentBlock));
    const voteEndDate = useMemo(
        () => new Date(Number(voteEnd) * 1000),
        [voteEnd],
    );

    useWatchBlocks({
        onBlock: async () => {
            await refetchPairs();
            await refetchCurrentBlock();
            await refetchEpochVoteEnd();
        },
    });
    return (
        <div className="relative overflow-hidden p-5 md:p-20">
            <Image
                src={Rectangle}
                alt="image"
                className="absolute -right-[100px] -top-[100px] w-[250px] lg:w-[200px]"
            />
            <Image
                src={Image2}
                alt="image"
                className="absolute top-0 w-[200px] lg:right-[250px] lg:w-[250px] xl:right-[350px] xl:w-[300px] 2xl:right-[400px]"
            />
            <Image
                src={Bear4}
                alt="bear"
                className="relative right-0 z-[1] m-auto mt-20 lg:absolute lg:right-[100px] lg:top-10 lg:m-0 xl:right-[200px]"
            />
            <div className="relative space-y-5 pt-10">
                <div className="flex max-w-[520px] flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl md:text-[50px]">
                            Vote with{" "}
                            <span className="text-gradient from-btn-primary to-gold">
                                veMONI
                            </span>{" "}
                            And
                        </h2>

                        <h2 className="text-3xl md:text-[50px]">
                            Govern the{" "}
                            <span className="text-gradient from-btn-primary to-gold">
                                Protocol
                            </span>
                        </h2>
                    </div>

                    <p className="text-sm text-swapBox md:text-[15px]">
                        Voters earn a share of transaction fees and incentives
                        for helping govern how emissions are distributed.
                    </p>
                </div>

                <div className="flex flex-col justify-between gap-3 bg-footer px-5 py-5 text-sm md:flex-row md:gap-0 md:px-10">
                    <div className="flex flex-col gap-3">
                        <p className="text-textgray">Total Vote Weight</p>
                        <p>{Number(formatUnits(totalWeight, 18))}</p>
                    </div>

                    <Divider
                        orientation="vertical"
                        className="h-[1px] bg-textlightgray max-md:w-full md:h-auto"
                    />

                    <div className="flex flex-col gap-3">
                        <p className="text-textgray">Total Incentives</p>
                        <p>Data currently unavailable</p>
                    </div>

                    <Divider
                        orientation="vertical"
                        className="h-[1px] bg-textlightgray max-md:w-full md:h-auto"
                    />

                    <div className="flex flex-col gap-3">
                        <p className="text-textgray">Total Rewards</p>
                        <p>Data currently unavailable</p>
                    </div>

                    <Divider
                        orientation="vertical"
                        className="h-[1px] bg-textlightgray max-md:w-full md:h-auto"
                    />

                    <div className="flex flex-col gap-3">
                        <p className="text-textgray">New Emissions</p>
                        <p>10,747,755.11</p>
                    </div>

                    <Divider
                        orientation="vertical"
                        className="h-[1px] bg-textlightgray max-md:w-full md:h-auto"
                    />

                    <div className="flex flex-col gap-3 md:text-right">
                        <p className="text-textgray">Current epoch ends on</p>
                        <p>{voteEndDate.toISOString()}</p>
                    </div>
                </div>
            </div>

            <p className="mt-10">Select Liquidity Pools for Voting</p>

            <div className="mt-5 space-y-5 bg-footer p-5">
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
                                        key={index}
                                        className="data-[hover=true]:border data-[hover=true]:border-btn-primary data-[hover=true]:bg-transparent data-[hover=true]:text-white"
                                    >
                                        {item.text}
                                    </SelectItem>
                                );
                            })}
                        </Select>
                    </div>
                    <div className="hidden w-[150px] text-right text-textlightgray lg:block">
                        {FAQ_TVL.title}{" "}
                        <Popover content={`${FAQ_TVL.description}`} />
                    </div>
                    <div className="hidden w-[150px] text-right text-textlightgray lg:block">
                        {"Fees"}
                    </div>
                    <div className="hidden w-[150px] text-right text-textlightgray lg:block">
                        {FAQ_INCENTIVES.title}
                        <Popover content={`${FAQ_INCENTIVES.description}`} />
                    </div>
                    <div className="hidden w-[150px] text-right text-textlightgray lg:block">
                        {FAQ_TOTAL_REWARD.title}
                        <Popover content={`${FAQ_TOTAL_REWARD.description}`} />
                    </div>
                    <div className="hidden w-[70px] text-right text-textlightgray lg:block">
                        {"vAPR"}
                    </div>
                </div>

                {pairs.map((item, index) => {
                    return (
                        <Pool data={item} key={index} tokenlist={tokenlist} />
                    );
                })}
            </div>
        </div>
    );
}
