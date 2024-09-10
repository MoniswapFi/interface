"use client";

import CongratesIcon from "@/assets/images/congrates.svg";
import { default as Logo, default as MoniIcon } from "@/assets/images/logo.svg";
import { AlignRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { ConnectButton } from "../ConnectButton";

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

    return (
        <div className="sticky bottom-0 mt-auto">
            {/* TODO: need to use redux store to sync with vote page */}
            {pathname === "/vote" && (
                <div className="md:px-10">
                    <div className="flex flex-col gap-2 border border-lightGray bg-brightBlack px-3 py-4 sm:flex-row md:gap-5 md:p-5">
                        <div className="flex flex-1 items-center justify-between bg-nightRider px-3 py-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-neroBlack p-3">
                                    <Image
                                        src={MoniIcon}
                                        alt="icon"
                                        className="w-[20px] md:w-[35px]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs md:text-base">
                                        Lock ID 12337
                                    </p>
                                    <p className="text-[10px] text-gray1 md:text-sm">
                                        35.41 MONI locked for 18 hours
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-gray1 md:text-sm">
                                <div className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-gray2 md:h-[30px] md:w-[30px]">
                                    0
                                </div>
                                Pool Selected
                            </div>
                        </div>

                        <div className="flex h-[50px] w-full cursor-pointer items-center justify-center bg-navSelected text-[10px] text-gray1 hover:text-white sm:h-auto sm:w-[100px] md:text-sm lg:w-[180px]">
                            Vote
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-center gap-2 bg-secondary py-4">
                <Image src={CongratesIcon} alt="icon" />
                <Link href={"/swap"}>
                    <p className="text-xs md:text-base">
                        Moniswap V1 Live on Bartio Testnet. Swap Now!
                    </p>
                </Link>
            </div>

            <div className="bg-header py-3 md:py-4">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10">
                    <Link href={"/"}>
                        <Image src={Logo} alt="icon" />
                    </Link>
                    <div className="hidden justify-center gap-7 md:flex">
                        {NavItems.map((item, index) => {
                            return (
                                <Link key={index} href={item.href}>
                                    {item.name}
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
        </div>
    );
};
