"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import MoniIcon from "@/assets/images/logo.svg";
import { Button } from "@/components/ui/button";
import { Divider, Input } from "@nextui-org/react";
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
                                <p>Depositing into Lock 12337</p>
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

                        <div className="flex justify-between">
                            <span>Add to lock</span>
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
                </div>

                <Button variant="primary" className="w-full">
                    Deposit
                </Button>
            </div>
        </div>
    );
}
