"use client";

import BEAR2 from "@/assets/images/bear2.png";
import BEAR3 from "@/assets/images/bear3.png";
import BEAR4 from "@/assets/images/bear4.png";
import BEAR5 from "@/assets/images/bear5.png";
import { NavItems } from "@/components/Header";
import { MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const getLongestItemWidth = (items: { name: string; href: string }[]) => {
  const longestItem = items.reduce((longest, current) =>
    current.name.length > longest.name.length ? current : longest,
  );

  const estimatedWidth = longestItem.name.length * 10 + 40;

  return estimatedWidth;
};

export default function Page() {
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMediumScreen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const longestWidth = useMemo(() => getLongestItemWidth(NavItems), []);

  return (
    <>
      <div className="px-5 py-20 md:px-20 lg:py-40">
        <div className="w-full justify-center text-center">
          <h1 className="text-4xl uppercase md:text-6xl">Page undiscovered!</h1>
          <p className="text-lg text-[#F59855] md:text-xl">
            Are we secretly building it?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-7 md:flex md:justify-center md:gap-12">
          {NavItems.map((item, index) => (
            <Link href={item.href} key={index}>
              <div
                className="flex h-[40px] w-full items-center justify-center gap-3 border border-[#F59855] bg-navItemBackground px-4 py-2 md:w-auto"
                style={isMediumScreen ? { width: `${longestWidth}px` } : {}}
              >
                <div className="w-full text-center">{item.name}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:mt-28 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/swap">
            <div className="hover:bg-hover-color flex h-full cursor-pointer flex-col justify-between bg-footer">
              <div className="space-y-4 px-4 pb-10 pt-4">
                <div className="flex items-start justify-between">
                  <p className="font-barlow text-6xl text-content-gray opacity-[0.18]">
                    01
                  </p>
                  <div className="rounded-full bg-black1 p-3 text-arrow-yellow">
                    <MoveUpRight size={18} />
                  </div>
                </div>
                <p className="text-[15px] leading-6">
                  Traders swap tokens with minimal slippage and pay some of the
                  lowest fees to MONI lockers.
                </p>
              </div>
              <div className="bg-btn-primary pt-8">
                <Image src={BEAR5} alt="bear" className="m-auto" />
              </div>
            </div>
          </Link>

          <Link href="/liquidity">
            <div className="hover:bg-hover-color flex h-full cursor-pointer flex-col justify-between bg-footer">
              <div className="space-y-4 px-4 pb-10 pt-4">
                <div className="flex items-start justify-between">
                  <p className="font-barlow text-6xl text-content-gray opacity-[0.18]">
                    02
                  </p>
                  <div className="rounded-full bg-black1 p-3 text-arrow-yellow">
                    <MoveUpRight size={18} />
                  </div>
                </div>
                <p className="text-[15px] leading-6">
                  Liquidity providers deposit the tokens used for trading on
                  Moniswap and receive MONI emissions as rewards.
                </p>
              </div>
              <div className="bg-btn-primary pt-8">
                <Image src={BEAR2} alt="bear" className="m-auto" />
              </div>
            </div>
          </Link>

          <Link href="/incentives">
            <div className="hover:bg-hover-color flex h-full cursor-pointer flex-col justify-between bg-footer">
              <div className="space-y-4 px-4 pb-10 pt-4">
                <div className="flex items-start justify-between">
                  <p className="font-barlow text-6xl text-content-gray opacity-[0.18]">
                    03
                  </p>
                  <div className="rounded-full bg-black1 p-3 text-arrow-yellow">
                    <MoveUpRight size={18} />
                  </div>
                </div>
                <p className="text-[15px] leading-6">
                  Protocols incentivize veMONI voters to attract votes and MONI
                  emissions to their pools, enabling them to build liquidity
                  cost-effectively.
                </p>
              </div>
              <div className="bg-btn-primary pt-8">
                <Image src={BEAR3} alt="bear" className="m-auto" />
              </div>
            </div>
          </Link>

          <Link href="/vote">
            <div className="hover:bg-hover-color flex h-full cursor-pointer flex-col justify-between bg-footer">
              <div className="space-y-4 px-4 pb-10 pt-4">
                <div className="flex items-start justify-between">
                  <p className="font-barlow text-6xl text-content-gray opacity-[0.18]">
                    04
                  </p>
                  <div className="rounded-full bg-black1 p-3 text-arrow-yellow">
                    <MoveUpRight size={18} />
                  </div>
                </div>
                <p className="text-[15px] leading-6">
                  veMONI voters vote on which pools will earn MONI emissions and
                  receive all incentives and fees. Any MONI holder can lock
                  their tokens to convert to veMONI.
                </p>
              </div>
              <div className="bg-btn-primary pt-8">
                <Image src={BEAR4} alt="bear" className="m-auto" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
