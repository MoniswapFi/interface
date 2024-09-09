import type { Lock } from "@/graphclient";
import { useGetLockMetadata } from "@/hooks/api/tokens";
import { useEscrowCore } from "@/hooks/onchain/escrow";
import { Divider } from "@nextui-org/react";
import Image from "next/image";
import { FC } from "react";
import { formatUnits } from "viem";
import { useWatchBlocks } from "wagmi";

type LockProps = {
    data: Lock;
};

export const LockItem: FC<LockProps> = ({ data }) => {
    const { data: metadata } = useGetLockMetadata({
        variables: { uri: data.tokenURI },
    });

    const { useEscrowReadables } = useEscrowCore();
    const { useLocked, useBalanceOfNFT } = useEscrowReadables();
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
                        <a
                            href="#"
                            className="text-sm text-btn-primary underline"
                        >
                            Increase
                        </a>
                        <a
                            href="#"
                            className="text-sm text-btn-primary underline"
                        >
                            Extend
                        </a>
                        <a
                            href="#"
                            className="text-sm text-btn-primary underline"
                        >
                            Merge
                        </a>
                        <a
                            href="#"
                            className="text-sm text-btn-primary underline"
                        >
                            Transfer
                        </a>
                        <a
                            href="#"
                            className="text-sm text-btn-primary underline"
                        >
                            Poke
                        </a>
                        <a
                            href="#"
                            className="text-sm text-btn-primary underline"
                        >
                            Reset
                        </a>
                        <a
                            href="#"
                            className="text-sm text-btn-primary underline"
                        >
                            Withdraw
                        </a>
                    </div>
                </div>
            </div>

            <Divider className="bg-swapBox lg:hidden" />

            <div className="flex flex-col justify-between gap-3 lg:items-end lg:gap-0">
                <p className="text-textgray">Rebase APR</p>
                <p>9.33%</p>
            </div>

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
                <p>locked for 4 years</p>
            </div>
        </div>
    );
};
