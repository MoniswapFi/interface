"use client";

import { default as Logo } from "@/assets/images/logo.svg";
import { useGetLockMetadata } from "@/hooks/api/tokens";
import { useLocks } from "@/hooks/graphql/escrow";
import { RootState } from "@/store";
import { encodePacked } from "@/utils/bytes";
import { toSF } from "@/utils/format";
import { AlignRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { zeroAddress } from "viem";
import { useAccount, useBlockNumber } from "wagmi";
import { ConnectButton } from "../ConnectButton";
import { VoteModal } from "../Modal/VoteModal";

export const NavItems = [
    {
        name: "Swap",
        href: "/swap",
    },
    {
        name: "Dashboard",
        href: "/dashboard",
    },
    {
        name: "Liquidity",
        href: "/liquidity",
    },
    {
        name: "Vote",
        href: "/vote",
    },
    {
        name: "Lock",
        href: "/lock",
    },
    {
        name: "Incentives",
        href: "/incentives",
    },
];

type Props = {
    toggleMenuOpen: () => void;
};

export const Header: FC<Props> = ({ toggleMenuOpen }) => {
    const pathname = usePathname();

    const [showVoteModal, setShowVoteModal] = useState(false);
    const useLocksQuery = useLocks();
    const { data: locks = [] } = useLocksQuery();
    const { data: currentBlock = BigInt(0) } = useBlockNumber();
    const { address = zeroAddress } = useAccount();
    const randomizedNum = useMemo(
        () =>
            Number(
                BigInt(
                    encodePacked(
                        ["address", "uint256", "uint"],
                        [
                            address,
                            currentBlock,
                            BigInt(Math.floor(Math.random() * 71118998)),
                        ],
                    ),
                ),
            ),
        [address, currentBlock],
    );
    const randomLock = useMemo(
        () => locks[randomizedNum % (locks.length ? locks.length : 1)],
        [locks, randomizedNum],
    );
    const { data: metadata } = useGetLockMetadata({
        variables: { uri: randomLock?.tokenURI ?? "" },
    });
    const { selectedPools } = useSelector((state: RootState) => state.voting);

    return (
        <div className="sticky bottom-0 z-10 mt-auto">
            {/* TODO: need to use redux store to sync with vote page */}
            {pathname === "/vote" && !!randomLock && !!metadata && (
                <div className="md:px-10">
                    <div className="flex flex-col gap-2 border border-lightGray bg-brightBlack px-3 py-4 sm:flex-row md:gap-5 md:p-5">
                        <div className="flex flex-1 items-center justify-between bg-nightRider px-3 py-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-neroBlack p-3">
                                    <Image
                                        src={metadata.image_data}
                                        alt="icon"
                                        className="w-[20px] md:w-[35px]"
                                        width={35}
                                        height={35}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs md:text-base">
                                        Lock ID {randomLock.tokenId}
                                    </p>
                                    <p className="text-[10px] text-gray1 md:text-sm">
                                        {toSF(randomLock.amountLocked)} MONI
                                        locked for{" "}
                                        {toSF(
                                            Number(randomLock.lockTime) /
                                                31536000,
                                        )}{" "}
                                        years
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray1 md:text-sm">
                                <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-gray2 md:h-[30px] md:w-[30px]">
                                    {selectedPools.length}
                                </div>
                                Pools Selected
                            </div>
                        </div>

                        <div
                            className="flex h-[50px] w-full cursor-pointer items-center justify-center bg-navSelected text-[10px] text-gray1 hover:text-white sm:h-auto sm:w-[100px] md:text-sm lg:w-[180px]"
                            onClick={() => setShowVoteModal(true)}
                        >
                            Vote
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-header py-3 md:py-4">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10">
                    <Link href={"/"}>
                        <Image src={Logo} alt="icon" />
                    </Link>
                    <div className="hidden justify-center gap-7 md:flex">
                        {NavItems.map((item, index) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={index} href={item.href}>
                                    <div
                                        className={`${
                                            isActive
                                                ? "bg-active text-[#F59855]"
                                                : "hover:border-[#F59855]/80 hover:bg-btn-black/20"
                                        } rounded border border-transparent px-4 py-2 hover:border-[#F59855]/80`}
                                    >
                                        {item.name}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4">
                        <ConnectButton />
                        <div
                            className="block cursor-pointer bg-btn-black p-2 md:hidden"
                            onClick={toggleMenuOpen}
                        >
                            <AlignRight size={30} />
                        </div>
                    </div>
                </div>
            </div>

            <VoteModal
                isOpen={showVoteModal}
                close={() => setShowVoteModal(false)}
            />
        </div>
    );
};
