"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import AutoReloadIcon from "@/assets/images/autoReload.svg";
import { Button } from "@/components/ui/button";
import { Divider, Slider, Switch } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    const [amount, setAmount] = useState(0.0);

    return (
        <div className="p-5 pb-20">
            <Image
                src={BEAR1}
                alt="bear"
                className="absolute left-[50%] top-0 translate-x-[-50%]"
                width={350}
            />

            <div className="z-1 relative m-auto mt-32 flex max-w-[620px] flex-col gap-10">
                <div className="bg-footer p-5 md:p-8">
                    <div className="flex flex-col gap-7 text-sm sm:text-base">
                        <div className="flex flex-col gap-5">
                            <div className="space-y-1">
                                <p>Extending lock for Lock 12337</p>
                                <p className="text-navDefault">
                                    <span className="text-white">35.41</span>{" "}
                                    MONI locked for 12 hours
                                </p>
                                <p className="text-navDefault">
                                    <span className="text-white">0.01238</span>{" "}
                                    veMONI voting power granted
                                </p>
                            </div>
                        </div>

                        <Divider className="bg-swapBox" />

                        <div className="flex flex-col gap-5 bg-darkestGray px-5 py-2 text-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Image alt="icon" src={AutoReloadIcon} />
                                    <span>Auto Max-Lock Mode</span>
                                </div>
                                <Switch
                                    defaultSelected
                                    aria-label="Automatic updates"
                                    classNames={{
                                        wrapper:
                                            "rounded-none border border-brightGray bg-brightBlack px-[2px]",
                                        thumb: "rounded-none group-data-[selected=true]:bg-btn-primary group-data-[selected=true]:ml-[22px]",
                                    }}
                                />
                            </div>
                            <p className="text-brightGray">
                                When activated, it sets the lock to maximum
                                unlock time, until disabled. Once disabled, the
                                regular vesting unlock time will apply. Maximum
                                unlock time gives a 1-to-1 voting power to the
                                amount of locked tokens.
                            </p>
                        </div>

                        <div className="text-navDefault">
                            Extending to 4 years for{" "}
                            <span className="text-white">34.88</span> veMONI
                            voting power.
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
                                    label: "Min",
                                },
                                {
                                    value: 25,
                                    label: ".",
                                },
                                {
                                    value: 50,
                                    label: ".",
                                },
                                {
                                    value: 75,
                                    label: ".",
                                },
                                {
                                    value: 100,
                                    label: "Max",
                                },
                            ]}
                        />
                    </div>
                </div>

                <Button variant="primary" className="w-full">
                    Extend
                </Button>
            </div>
        </div>
    );
}
