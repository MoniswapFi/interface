"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import MoniIcon from "@/assets/images/logo.svg";
import { TransactionInfoModal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { __MONI__, __VOTING_ESCROW__ } from "@/config/constants";
import { useEscrowCore } from "@/hooks/onchain/escrow";
import { useERC20Allowance, useERC20Balance } from "@/hooks/onchain/wallet";
import { toSF } from "@/utils/format";
import { Divider, Input, Slider } from "@nextui-org/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useChainId, useWatchBlocks } from "wagmi";

export default function Page() {
    const [amount, setAmount] = useState(0.0);
    const [duration, setDuration] = useState(0);
    const [showTXInfoModal, setShowTXInfoModal] = useState(false);

    const chainId = useChainId();
    const moni = useMemo(() => __MONI__[chainId], [chainId]);
    const escrow = useMemo(() => __VOTING_ESCROW__[chainId], [chainId]);

    const { useEscrowExecutions } = useEscrowCore();
    const {
        createLock,
        hash: createLockHash,
        isError: createLockError,
        isPending: createLockPending,
        isSuccess: createLockSuccess,
        reset: resetCreateLock,
    } = useEscrowExecutions(() => setShowTXInfoModal(true));

    const { balance } = useERC20Balance(moni as any);
    const { useAllowance, useApproval } = useERC20Allowance(moni as any);
    const { data: allowance = BigInt(0), refetch: refetchAllowance } =
        useAllowance(escrow as any);
    const { executeApproval, isPending: approvalPending } = useApproval(
        escrow as any,
        Number(parseUnits(amount.toString(), 18)),
    );
    const allowedToSpend = useMemo(
        () => Number(formatUnits(allowance, 18)),
        [allowance],
    );

    useWatchBlocks({
        onBlock: async () => {
            await refetchAllowance();
        },
    });

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
                                <span>Available {balance.toFixed(4)} MONI</span>
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

                        <p>
                            Locking for {duration / 31536000} years for{" "}
                            {toSF((duration / 31536000 / 4) * amount)} veMONI
                            voting power.
                        </p>

                        <Slider
                            onChange={(value) => setDuration(value as number)}
                            size="md"
                            step={86400}
                            maxValue={126144000}
                            minValue={604800}
                            aria-label="Temperature"
                            defaultValue={duration}
                            color="warning"
                            classNames={{
                                mark: "w-max",
                                track: "rounded-none border-none h-[8px]",
                                thumb: "flex-shrink-0 bg-btn-primary",
                                filler: "bg-btn-primary",
                            }}
                            marks={[
                                {
                                    value: 604800,
                                    label: "7 D",
                                },
                                {
                                    value: 31536000,
                                    label: "1 Y",
                                },
                                {
                                    value: 63072000,
                                    label: "2 Y",
                                },
                                {
                                    value: 94608000,
                                    label: "3 Y",
                                },
                                {
                                    value: 126144000,
                                    label: "4 Y",
                                },
                            ]}
                        />
                    </div>
                </div>

                {allowedToSpend >= amount ? (
                    <Button
                        variant="primary"
                        onClick={() =>
                            createLock(
                                parseUnits(amount.toString(), 18),
                                duration,
                            )
                        }
                        disabled={createLockPending || amount <= 0}
                        isLoading={createLockPending}
                        className="w-full"
                    >
                        Lock MONI
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={executeApproval}
                        disabled={approvalPending || amount <= 0}
                        isLoading={approvalPending}
                        className="w-full"
                    >
                        Allow MONI
                    </Button>
                )}
            </div>

            <TransactionInfoModal
                isOpen={showTXInfoModal}
                close={() => {
                    setShowTXInfoModal(false);
                    resetCreateLock();
                }}
                type={
                    createLockSuccess
                        ? "success"
                        : createLockError
                          ? "failure"
                          : "failure"
                }
                txHash={createLockHash}
            />
        </div>
    );
}
