"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import BearIcon from "@/assets/images/Bera.png";
import MoniIcon from "@/assets/images/logo.svg";
import { IncentiveSelectModal } from "@/components/Modal/IncentiveSelectModal";
import { Button } from "@/components/ui/button";
import { ChipBadge } from "@/components/ui/chipBadge";
import { Divider, Slider } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    const [amount, setAmount] = useState(0.0);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="p-5 pb-20">
            <Image
                src={BEAR1}
                alt="bear"
                className="absolute left-[50%] top-0 translate-x-[-50%]"
                width={350}
            />

            <div className="z-1 relative m-auto mt-32 flex max-w-[620px] flex-col gap-10">
                <div className="flex flex-col gap-5 bg-footer p-5 md:p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
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
                                <span>vAMM-HONEY/BERA</span>
                                <ChipBadge>Basic Stable · 1.0%</ChipBadge>
                            </div>
                        </div>

                        <div className="text-right text-navDefault">
                            <p>APR</p>
                            <p>21.34%</p>
                        </div>
                    </div>

                    <Divider className="bg-swapBox" />

                    <div className="flex flex-col gap-2 text-navDefault">
                        <div className="flex justify-between">
                            <p>Liquidity</p>
                            <p>Your Deposits #0</p>
                        </div>

                        <div className="flex justify-between">
                            <p>456.87 HONEY</p>
                            <p>0.00 HONEY</p>
                        </div>

                        <div className="flex justify-between">
                            <p>456.87 BERA</p>
                            <p>0.00 BERA</p>
                        </div>
                    </div>

                    <Divider className="bg-swapBox" />

                    <div>
                        <div className="flex justify-between">
                            <p>Withdraw 100%</p>
                        </div>
                    </div>

                    <Slider
                        size="md"
                        step={25}
                        maxValue={100}
                        minValue={0}
                        aria-label="Temperature"
                        defaultValue={25}
                        color="warning"
                        classNames={{
                            mark: "w-max",
                            track: "rounded-none border-none h-[8px]",
                            thumb: "flex-shrink-0 bg-btn-primary",
                            filler: "bg-btn-primary",
                        }}
                        marks={[
                            {
                                value: 0,
                                label: "0%",
                            },
                            {
                                value: 25,
                                label: "25%",
                            },
                            {
                                value: 50,
                                label: "50%",
                            },
                            {
                                value: 75,
                                label: "75%",
                            },
                            {
                                value: 100,
                                label: "100%",
                            },
                        ]}
                    />
                </div>

                <Button variant="primary" className="w-full capitalize">
                    withdraw
                </Button>
            </div>

            <IncentiveSelectModal
                isOpen={showModal}
                close={() => setShowModal(false)}
            />
        </div>
    );
}
