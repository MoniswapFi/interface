"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import BearIcon from "@/assets/images/Bera.png";
import MoniIcon from "@/assets/images/logo.svg";
import { TokenSelectModal } from "@/components/Modal";
import { IncentiveSelectModal } from "@/components/Modal/IncentiveSelectModal";
import { Button } from "@/components/ui/button";
import { ChipBadge } from "@/components/ui/chipBadge";
import { useGetTokenLists } from "@/hooks/api/tokens";
import { TokenType } from "@/types";
import { Divider, Input } from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
    const [amount, setAmount] = useState(0.0);
    const [showModal, setShowModal] = useState(false);
    const [showTokenSelectionModal, setShowTokenSelectionModal] =
        useState(false);
    const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);

    const selectedTokens = [selectedToken, null];

    const { data: tokenLists = [] } = useGetTokenLists({});

    return (
        <div className="p-5 pb-20">
            <Image
                src={BEAR1}
                alt="bear"
                className="absolute left-[50%] top-0 translate-x-[-50%]"
                width={350}
            />

            <div className="z-1 relative m-auto mt-32 flex max-w-[620px] flex-col gap-10">
                <div className="flex flex-col gap-7 bg-footer p-5 md:p-8">
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
                                <p>vAMM-HONEY/BERA</p>
                                <ChipBadge>Basic Stable · 1.0%</ChipBadge>
                            </div>
                        </div>

                        <div
                            className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full bg-darkgray"
                            onClick={() => setShowModal(true)}
                        >
                            <ChevronDown size={20} />
                        </div>
                    </div>

                    <Divider className="bg-swapBox" />

                    <div className="flex flex-col gap-2 text-navDefault">
                        <div className="flex justify-between">
                            <p>Liquidity</p>
                            <p>Your Position</p>
                        </div>

                        <div className="flex justify-between">
                            <p>
                                <span className="text-white">456.87</span> HONEY
                            </p>
                            <p>0.00 HONEY</p>
                        </div>

                        <div className="flex justify-between">
                            <p>
                                <span className="text-white">456.87</span> BERA
                            </p>
                            <p>0.00 BERA</p>
                        </div>
                    </div>

                    <Divider className="bg-swapBox" />

                    <div className="flex flex-col gap-2 text-navDefault">
                        <div className="flex flex-wrap justify-between">
                            <div className="w-[50%] space-y-2 sm:w-fit">
                                <p>APR</p>
                                <p className="text-white">336.57%</p>
                            </div>
                            <div className="w-[50%] space-y-2 sm:w-fit">
                                <p>Current Vote</p>
                                <p className="text-white">14,460,983.99</p>
                            </div>
                            <div className="mt-7 w-full space-y-2 sm:mt-0 sm:w-fit sm:text-right">
                                <p>Current Incentives</p>
                                <p className="text-white">$3,663.85</p>
                            </div>
                        </div>
                    </div>

                    <Divider className="bg-swapBox" />

                    <div>
                        <div className="flex justify-between">
                            <p>Your Incentives</p>
                            <p>Available 0.00 MONI</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            className="flex h-[50px] flex-[2_2_0%] cursor-pointer items-center justify-between border-b border-l border-t border-swapBox bg-btn-black px-3"
                            onClick={() => setShowTokenSelectionModal(true)}
                        >
                            {selectedToken && (
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={selectedToken.logoURI}
                                        alt={selectedToken.name}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                    <span>{selectedToken.symbol}</span>
                                </div>
                            )}

                            <ChevronDown />
                        </button>

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

                <Button variant="primary" className="w-full capitalize">
                    add incentives
                </Button>
            </div>

            <IncentiveSelectModal
                isOpen={showModal}
                close={() => setShowModal(false)}
            />

            <TokenSelectModal
                isOpen={showTokenSelectionModal}
                selectedTokens={selectedTokens as [TokenType, TokenType]}
                close={() => setShowTokenSelectionModal(false)}
                tokenLists={tokenLists}
                onItemClick={(t) => setSelectedToken(t)}
            />
        </div>
    );
}
