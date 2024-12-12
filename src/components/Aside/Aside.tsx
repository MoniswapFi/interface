"use client";

import Logo from "@/assets/images/logo.svg";
import { cn } from "@nextui-org/react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect } from "react";
import { ConnectButton } from "../ConnectButton";
import { NavItems } from "../Header";

type Props = {
  showMenu: boolean;
  hideMenu: () => void;
};

export const AsideBar: FC<Props> = ({ showMenu, hideMenu }) => {
  const pathname = usePathname();

  useEffect(() => {
    hideMenu();
  }, [pathname]);

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-20 h-svh w-0 overflow-hidden bg-navBackground duration-200",
        {
          "w-full": showMenu,
        },
      )}
    >
      <div className="flex items-center justify-between bg-header px-5 py-3">
        <Link href={"/"}>
          <Image src={Logo} alt="logo" />
        </Link>

        <div className="flex items-center gap-4">
          <ConnectButton />
          <div className="cursor-pointer bg-btn-black p-2" onClick={hideMenu}>
            <X size={32} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-7">
        {NavItems.map((item, index) => {
          return (
            <Link href={item.href} key={index}>
              <div className="flex h-[40px] items-center gap-3 bg-navItemBackground">
                <div
                  className={cn("h-full w-[7px] bg-navDefault", {
                    "bg-navSelected": pathname === item.href,
                  })}
                ></div>
                <div>{item.name}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
