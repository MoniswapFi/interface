"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import MoniIcon from "@/assets/images/logo.svg";
import { TransactionInfoModal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { __MONI__, __VOTING_ESCROW__ } from "@/config/constants";
import { useEscrowCore } from "@/hooks/onchain/escrow";
import { useERC20Allowance, useERC20Balance } from "@/hooks/onchain/wallet";
import { Divider, Input } from "@nextui-org/react";
import Image from "next/image";
import { FC, useMemo, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useChainId, useWatchBlocks } from "wagmi";

type PageProps = {
    params: {
        tokenId: string;
    };
};

const Page: FC<PageProps> = ({ params }) => {
    const [amount, setAmount] = useState(0.0);
    const [showTXInfoModal, setShowTXInfoModal] = useState(false);

    const chainId = useChainId();
    const moni = useMemo(() => __MONI__[chainId], [chainId]);
    const escrow = useMemo(() => __VOTING_ESCROW__[chainId], [chainId]);

    const { useEscrowExecutions, useEscrowReadables } = useEscrowCore();

    const {
        increaseAmount,
        isError: increaseAmountError,
        isPending: increaseAmountPending,
        isSuccess: increaseAmountSuccess,
        hash: increaseAmountHash,
        reset: resetIncreaseAmount,
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

    const yearsLocked = useMemo(
        () => (Number(locked.end) - Math.floor(Date.now() / 1000)) / 31536000,
        [locked.end],
    );

    useWatchBlocks({
        onBlock: async () => {
            await refetchAllowance();
            await refetchNFTBalance();
            await refetchLocked();
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
                                <p>Depositing into lock #{params.tokenId}</p>
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

                        <div className="flex justify-between">
                            <span>Add to lock</span>
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
                </div>

                {allowedToSpend >= amount ? (
                    <Button
                        variant="primary"
                        onClick={() =>
                            increaseAmount(
                                Number(params.tokenId),
                                parseUnits(amount.toString(), 18),
                            )
                        }
                        disabled={increaseAmountPending || amount <= 0}
                        isLoading={increaseAmountPending}
                        className="w-full"
                    >
                        Deposit MONI
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
                    resetIncreaseAmount();
                }}
                type={
                    increaseAmountSuccess
                        ? "success"
                        : increaseAmountError
                          ? "failure"
                          : "failure"
                }
                txHash={increaseAmountHash}
            />
        </div>
    );
};

export default Page;
