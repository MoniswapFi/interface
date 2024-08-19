import CongratesIcon from "@/assets/images/congrates.svg";
import Logo from "@/assets/images/logo.svg";
import { AlignRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    return (
        <div className="sticky bottom-0">
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
