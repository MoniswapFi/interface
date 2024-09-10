"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import AutoReloadIcon from "@/assets/images/autoReload.svg";
import { TransactionInfoModal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useEscrowCore } from "@/hooks/onchain/escrow";
import { Divider, Slider, Switch } from "@nextui-org/react";
import Image from "next/image";
import { FC, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useWatchBlocks } from "wagmi";

type PageProps = {
    params: {
        tokenId: string;
    };
};

const Page: FC<PageProps> = ({ params }) => {
    const [showTXInfoModal, setShowTXInfoModal] = useState(false);
    const [duration, setDuration] = useState(126144000);
    const [maxLockSelected, setMaxLockSelected] = useState(false);

    const { useEscrowExecutions, useEscrowReadables } = useEscrowCore();
    const {
        increaseUnlockTime,
        isError: increaseUnlockTimeError,
        isPending: increaseUnlockTimePending,
        isSuccess: increaseUnlockTimeSuccess,
        hash: increaseUnlockTimeHash,
        reset: resetIncreaseUnlockTime,
    } = useEscrowExecutions(() => setShowTXInfoModal(true));
    const { useLocked, useBalanceOfNFT } = useEscrowReadables();
    const {
        data: locked = {
            amount: BigInt(0),
            end: BigInt(0),
            isPermanent: false,
        },
        refetch: refetchLocked,
    } = useLocked(Number(params.tokenId));
    const { data: weight = BigInt(0), refetch: refetchNFTBalance } =
        useBalanceOfNFT(Number(params.tokenId));

    const yearsLocked = useMemo(
        () => (Number(locked.end) - Math.floor(Date.now() / 1000)) / 31536000,
        [locked.end],
    );

    useWatchBlocks({
        onBlock: async () => {
            await refetchLocked();
            await refetchNFTBalance();
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
                    <div className="flex flex-col gap-7 text-sm sm:text-base">
                        <div className="flex flex-col gap-5">
                            <div className="space-y-1">
                                <p>Extending lock #{params.tokenId}</p>
                                <p className="text-navDefault">
                                    <span className="text-white">
                                        {Number(
                                            formatUnits(locked.amount, 18),
                                        ).toLocaleString("en-US", {
                                            maximumFractionDigits: 4,
                                            useGrouping: true,
                                        })}
                                    </span>{" "}
                                    MONI locked for {yearsLocked.toFixed(5)}{" "}
                                    years
                                </p>
                                <p className="text-navDefault">
                                    <span className="text-white">
                                        {Number(
                                            formatUnits(weight, 18),
                                        ).toLocaleString("en-US", {
                                            maximumFractionDigits: 4,
                                            useGrouping: true,
                                        })}
                                    </span>{" "}
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
                                    onValueChange={(selected) => {
                                        setDuration(
                                            selected ? 126144000 : duration,
                                        );
                                        setMaxLockSelected(selected);
                                    }}
                                    defaultSelected={maxLockSelected}
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
                            Extending to {duration / 31536000} years{" "}
                        </div>

                        <Slider
                            onChange={(value) => setDuration(value as number)}
                            size="md"
                            step={86400}
                            maxValue={126144000}
                            minValue={604800}
                            aria-label="Temperature"
                            defaultValue={duration}
                            isDisabled={maxLockSelected}
                            color="warning"
                            classNames={{
                                mark: "w-max",
                                track: "rounded-none border-none h-[8px]",
                                thumb: "flex-shrink-0 bg-btn-primary",
                                filler: "bg-btn-primary",
                            }}
                            marks={[
                                {
                                    value: 31536000,
                                    label: "Min",
                                },
                                {
                                    value: 63072000,
                                    label: ".",
                                },
                                {
                                    value: 94608000,
                                    label: ".",
                                },
                                {
                                    value: 126144000,
                                    label: "Max",
                                },
                            ]}
                        />
                    </div>
                </div>

                <Button
                    onClick={() =>
                        increaseUnlockTime(Number(params.tokenId), duration)
                    }
                    isLoading={increaseUnlockTimePending}
                    disabled={increaseUnlockTimePending || duration <= 0}
                    variant="primary"
                    className="w-full"
                >
                    Extend
                </Button>
            </div>

            <TransactionInfoModal
                isOpen={showTXInfoModal}
                close={() => {
                    setShowTXInfoModal(false);
                    resetIncreaseUnlockTime();
                }}
                type={
                    increaseUnlockTimeSuccess
                        ? "success"
                        : increaseUnlockTimeError
                          ? "failure"
                          : "failure"
                }
                txHash={increaseUnlockTimeHash}
            />
        </div>
    );
};

export default Page;
