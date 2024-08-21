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
                                <p>Lock transfer</p>
                            </div>
                        </div>

                        <Divider className="bg-swapBox" />

                        <div className="item flex items-center gap-3">
                            <div className="bg-black p-2">
                                <Image
                                    src={MoniIcon}
                                    alt="icon"
                                    className="w-[50px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <p>Lock ID 12337</p>
                                <p className="text-navDefault">
                                    <span className="text-white">35.41</span>{" "}
                                    MONI locked for 12 hours
                                </p>
                            </div>
                        </div>

                        <Divider className="bg-swapBox" />

                        <p>To wallet Address</p>

                        <div>
                            <Input
                                radius="none"
                                placeholder="0x"
                                classNames={{
                                    base: "bg-btn-black border-swapBox border",
                                    inputWrapper:
                                        "bg-transparent group-data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent",
                                    input: "!text-white",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <Button variant="primary" className="w-full">
                    Transfer
                </Button>
            </div>
        </div>
    );
}
