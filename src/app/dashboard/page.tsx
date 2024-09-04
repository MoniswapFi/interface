"use client";

import BearIcon from "@/assets/images/Bera.png";
import CheckIcon from "@/assets/images/check.svg";
import Image2 from "@/assets/images/image2.svg";
import MoniIcon from "@/assets/images/logo.svg";
import Rectangle from "@/assets/images/Rectangle_t.svg";
import { ChipBadge } from "@/components/ui/chipBadge";
import { usePoolPositions } from "@/hooks/graphql/core";
import Image from "next/image";
import { useState } from "react";
import { useWatchBlocks } from "wagmi";
import { LiquidityReward } from "./_components/LiquidityReward";

export default function Page() {
    const [selectedTab, setSelectedTab] = useState("pools");
    const usePositionsQuery = usePoolPositions();
    const { data: positions = [], refetch: refetchAccountPositions } =
        usePositionsQuery();

    useWatchBlocks({
        onBlock: async () => {
            await refetchAccountPositions();
        },
    });

    return (
        <div className="relative space-y-10 overflow-hidden p-5 md:p-20">
            <Image
                src={Rectangle}
                alt="image"
                className="absolute -right-[100px] -top-[100px] w-[250px] lg:w-[200px]"
            />
            <Image
                src={Image2}
                alt="image"
                className="right-[100px] top-[0] !mt-0 w-[200px] lg:absolute lg:w-[350px]"
            />

            <div className="relative space-y-5 lg:pb-28 lg:pt-10">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl md:text-[50px]">
                            Manage Your{" "}
                            <span className="text-gradient from-btn-primary to-gold">
                                Liquidity
                            </span>
                        </h2>

                        <h2 className="text-3xl md:text-[50px]">
                            And Voting{" "}
                            <span className="text-gradient from-btn-primary to-gold">
                                Rewards
                            </span>
                        </h2>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <p className="text-lg md:text-2xl">Liquidity Rewards</p>
                <div className="flex flex-col gap-3">
                    {positions.map((position) => (
                        <LiquidityReward data={position} key={position.id} />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-5">
                <p className="text-lg md:text-2xl">Voting Rewards</p>
                <div>
                    <div className="flex flex-col justify-between gap-3 bg-footer p-5 lg:flex-row lg:gap-0">
                        <div className="flex items-start">
                            <div className="flex items-center">
                                <Image src={BearIcon} alt="icon" width={30} />
                                <Image
                                    src={MoniIcon}
                                    alt="icon"
                                    width={30}
                                    className="-translate-x-3"
                                />
                            </div>

                            <div>
                                <p>vAMM-MONI/BERA</p>
                                <p className="bg-darkgray px-2 py-1 text-xs text-lightblue">
                                    Basic Volatile · 1.0%
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between gap-5 lg:items-end">
                            <div className="lg:text-right">
                                <p className="text-textgray">Lock #14854</p>
                                <p>
                                    783.057{" "}
                                    <span className="text-textgray">
                                        MONI locked
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="flex min-w-0 flex-col justify-between gap-5 lg:items-end">
                            <div className="flex flex-col gap-3">
                                <p className="text-textgray lg:text-right">
                                    Rewards
                                </p>
                                <div className="flex items-center justify-between gap-3 lg:justify-end">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={MoniIcon}
                                            alt="icon"
                                            width={30}
                                        />
                                        0.00057{" "}
                                        <span className="text-textgray">
                                            MONI
                                        </span>
                                    </div>
                                    <ChipBadge>
                                        <span>FEE</span>
                                    </ChipBadge>
                                </div>
                                <div className="flex items-center justify-between gap-3 lg:justify-end">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={BearIcon}
                                            alt="icon"
                                            width={30}
                                        />
                                        0.00057{" "}
                                        <span className="text-textgray">
                                            BERA
                                        </span>
                                    </div>
                                    <ChipBadge>FEE</ChipBadge>
                                </div>
                                <div className="flex items-center justify-between gap-3 lg:justify-end">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={BearIcon}
                                            alt="icon"
                                            width={30}
                                        />
                                        0.00057{" "}
                                        <span className="text-textgray">
                                            BERA
                                        </span>
                                    </div>
                                    <ChipBadge>INCENTIVES</ChipBadge>
                                </div>
                                <div className="flex items-center justify-between gap-3 lg:justify-end">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={BearIcon}
                                            alt="icon"
                                            width={30}
                                        />
                                        0.00057{" "}
                                        <span className="text-textgray">
                                            BERA
                                        </span>
                                    </div>
                                    <ChipBadge>INCENTIVES</ChipBadge>
                                </div>
                                <div className="flex items-center justify-between gap-3 lg:justify-end">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={BearIcon}
                                            alt="icon"
                                            width={30}
                                        />
                                        0.00057{" "}
                                        <span className="text-textgray">
                                            BERA
                                        </span>
                                    </div>
                                    <ChipBadge>INCENTIVES</ChipBadge>
                                </div>
                                <div className="flex items-center justify-between gap-3 lg:justify-end">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={BearIcon}
                                            alt="icon"
                                            width={30}
                                        />
                                        0.00057{" "}
                                        <span className="text-textgray">
                                            BERA
                                        </span>
                                    </div>
                                    <ChipBadge>INCENTIVES</ChipBadge>
                                </div>
                            </div>
                            <p className="flex cursor-pointer items-center gap-2 text-btn-primary lg:justify-end">
                                <Image alt="check icon" src={CheckIcon} />
                                <span>CLAIM</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
