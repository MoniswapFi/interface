import { TransactionInfoModal } from "@/components/Modal";
import type { Lock } from "@/graphclient";
import { useGetLockMetadata } from "@/hooks/api/tokens";
import { useTimeInMotion } from "@/hooks/misc";
import { useEscrowCore } from "@/hooks/onchain/escrow";
import { useVoterCore } from "@/hooks/onchain/voting";
import { toSF } from "@/utils/format";
import { Divider } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { formatUnits } from "viem";
import { useWatchBlocks } from "wagmi";

type LockProps = {
    data: Lock;
};

export const LockItem: FC<LockProps> = ({ data }) => {
    const [showTXInfoModal, setShowTXInfoModal] = useState(false);
    const { data: metadata } = useGetLockMetadata({
        variables: { uri: data.tokenURI },
    });

    const { useEscrowReadables, useEscrowExecutions } = useEscrowCore();
    const { useVotingExecutions } = useVoterCore();
    const { useLocked, useBalanceOfNFT } = useEscrowReadables();
    const {
        withdraw,
        isError: withdrawError,
        isSuccess: withdrawSuccess,
        isPending: withdrawPending,
        hash: withdrawHash,
        reset: resetWithdraw,
    } = useEscrowExecutions(() => setShowTXInfoModal(true));
    const {
        resetLock,
        poke,
        isError: veTxError,
        isSuccess: veTxSuccess,
        isPending: veTxPending,
        hash: veTxHash,
        reset: resetveTx,
    } = useVotingExecutions(() => setShowTXInfoModal(true));
    const {
        data: locked = {
            amount: BigInt(0),
            end: BigInt(0),
            isPermanent: false,
        },
        refetch: refetchLocked,
    } = useLocked(Number(data.tokenId));
    const { data: weight = BigInt(0), refetch: refetchNFTBalance } =
        useBalanceOfNFT(Number(data.tokenId));

    const timeInMotion = useTimeInMotion();

    useWatchBlocks({
        onBlock: async () => {
            await refetchLocked();
            await refetchNFTBalance();
        },
    });

    return (
        <div className="flex w-full flex-col justify-between gap-3 bg-footer p-5 text-sm lg:flex-row lg:gap-0">
            <div className="flex items-start gap-5 lg:w-[35%]">
                <Image
                    src={metadata?.image_data || ""}
                    alt={data.tokenId}
                    width={80}
                    height={80}
                />

                <div className="space-y-2">
                    <p>Lock #{data.tokenId}</p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/lock/deposit/${Number(data.tokenId)}`}
                            className="text-sm text-btn-primary underline"
                        >
                            Increase
                        </Link>
                        <Link
                            href={`/lock/extend/${Number(data.tokenId)}`}
                            className="text-sm text-btn-primary underline"
                        >
                            Extend
                        </Link>
                        <Link
                            href={`/lock/merge/${Number(data.tokenId)}`}
                            className="text-sm text-btn-primary underline"
                        >
                            Merge
                        </Link>
                        <Link
                            href={`/lock/transfer/${Number(data.tokenId)}`}
                            className="text-sm text-btn-primary underline"
                        >
                            Transfer
                        </Link>
                        <button
                            onClick={() => poke(Number(data.tokenId))}
                            disabled={veTxPending}
                            className="cursor-pointer text-sm text-btn-primary underline"
                        >
                            Poke
                        </button>
                        <button
                            onClick={() => resetLock(Number(data.tokenId))}
                            disabled={veTxPending}
                            className="cursor-pointer text-sm text-btn-primary underline"
                        >
                            Reset
                        </button>
                        <button
                            disabled={withdrawPending}
                            onClick={() => withdraw(Number(data.tokenId))}
                            className="cursor-pointer text-sm text-btn-primary underline"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>
            </div>

            {/* <Divider className="bg-swapBox lg:hidden" />

            <div className="flex flex-col justify-between gap-3 lg:items-end lg:gap-0">
                <p className="text-textgray">Rebase APR</p>
                <p>9.33%</p>
            </div> */}

            <Divider className="bg-swapBox lg:hidden" />

            <div className="flex flex-col justify-between gap-3 lg:items-end lg:gap-0">
                <p className="text-textgray">Locked Amount</p>
                <p>
                    {Number(formatUnits(locked.amount, 18)).toLocaleString(
                        "en-US",
                        { maximumFractionDigits: 4, useGrouping: true },
                    )}{" "}
                    MONI
                </p>
            </div>

            <Divider className="bg-swapBox lg:hidden" />

            <div className="flex flex-col justify-between gap-3 lg:items-end lg:gap-0">
                <p className="text-textgray">Voting Power</p>
                <p>
                    {Number(formatUnits(weight, 18)).toLocaleString("en-US", {
                        maximumFractionDigits: 4,
                        useGrouping: true,
                    })}{" "}
                    veMONI
                </p>
            </div>

            <Divider className="bg-swapBox lg:hidden" />

            <div className="flex flex-col justify-between gap-3 lg:items-end lg:gap-0">
                <p className="text-textgray">Unlock Date</p>
                <p>locked for {toSF(Number(data.lockTime) / 31536000)} years</p>
            </div>

            <TransactionInfoModal
                isOpen={showTXInfoModal}
                close={() => {
                    setShowTXInfoModal(false);
                    if (typeof withdrawHash !== "undefined") {
                        resetWithdraw();
                    }

                    if (typeof veTxHash !== "undefined") {
                        resetveTx();
                    }
                }}
                type={
                    withdrawSuccess || veTxSuccess
                        ? "success"
                        : withdrawError || veTxError
                          ? "failure"
                          : "failure"
                }
                txHash={withdrawHash ?? veTxHash}
            />
        </div>
    );
};
