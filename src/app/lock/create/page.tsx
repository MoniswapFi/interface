"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import MoniIcon from "@/assets/images/logo.svg";
import { Button } from "@/components/ui/button";
import { Divider, Input, Slider } from "@nextui-org/react";
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
                    <div className="flex flex-col gap-10 text-sm sm:text-base">
                        <div className="flex flex-col gap-5">
                            <div className="flex justify-between">
                                <span>Amount to Lock</span>
                                <span>Available 0.00 MONI</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex h-[50px] flex-[2_2_0%] items-center border-b border-l border-t border-swapBox bg-btn-black px-3">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            alt="icon"
                                            src={MoniIcon}
                                            className="w-[30px]"
                                        />
                                        <span>MONI</span>
                                    </div>
                                </div>
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

                        <Divider className="bg-swapBox" />

                        <p>Locking for 4 years for 0.0 veMONI voting power.</p>

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
                                    label: "7 D",
                                },
                                {
                                    value: 25,
                                    label: "1 Y",
                                },
                                {
                                    value: 50,
                                    label: "2 Y",
                                },
                                {
                                    value: 75,
                                    label: "3 Y",
                                },
                                {
                                    value: 100,
                                    label: "4 Y",
                                },
                            ]}
                        />
                    </div>
                </div>

                <Button variant="primary" className="w-full">
                    Lock MONI
                </Button>
            </div>
        </div>
    );
}
