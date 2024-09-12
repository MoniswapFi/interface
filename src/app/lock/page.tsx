"use client";

import Bear4 from "@/assets/images/bear2.png";
import Image2 from "@/assets/images/image2.svg";
import Rectangle from "@/assets/images/Rectangle_t.svg";
import { Button } from "@/components/ui/button";
import { useLocks } from "@/hooks/graphql/escrow";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useWatchBlocks } from "wagmi";
import { LockItem } from "./_components/Lock";

export default function Page() {
    const useLocksQuery = useLocks();
    const { data: locks = [], refetch: refetchLocks } = useLocksQuery();

    useWatchBlocks({
        onBlock: async () => {
            await refetchLocks();
        },
    });

    return (
        <div className="relative overflow-hidden p-5 md:p-20">
            <Image
                src={Rectangle}
                alt="image"
                className="absolute -right-[100px] -top-[100px] w-[250px] lg:w-[200px]"
            />
            <Image
                src={Image2}
                alt="image"
                className="absolute top-0 w-[200px] lg:right-[250px] lg:w-[250px] xl:right-[350px] xl:w-[300px] 2xl:right-[400px]"
            />
            <Image
                src={Bear4}
                alt="bear"
                className="relative right-0 z-[1] m-auto mt-20 lg:absolute lg:right-[100px] lg:top-10 lg:m-0 xl:right-[200px]"
            />
            <div className="relative space-y-10 pt-10">
                <div className="flex max-w-[520px] flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl md:text-[50px]">
                            Create{" "}
                            <span className="text-gradient from-btn-primary to-gold">
                                Lock
                            </span>{" "}
                            And
                        </h2>

                        <h2 className="text-3xl md:text-[50px]">
                            Gain Voting{" "}
                            <span className="text-gradient from-btn-primary to-gold">
                                Power
                            </span>
                        </h2>
                    </div>

                    <p className="text-sm text-swapBox md:text-[15px]">
                        Lock MONI into veMONI to earn and govern. Vote with
                        veMONI to earn incentives and trading fees.
                    </p>
                </div>

                <div className="space-y-5 lg:!mt-20">
                    <div className="flex items-center justify-between">
                        <div>Locks</div>

                        <Link href={"/lock/create"}>
                            <Button variant="primary" size="sm">
                                Create Lock
                            </Button>
                        </Link>
                    </div>

                    {locks.length > 0 ? (
                        <div className="flex w-full flex-col items-center justify-start gap-3">
                            {locks.map((lock) => (
                                <LockItem data={lock} key={lock.id} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex w-full gap-3 bg-footer px-5 py-3 text-textgray md:items-center">
                            <span className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-textgray">
                                <FontAwesomeIcon icon={faInfo} size="xs" />
                            </span>
                            To receive incentives, and fees, create a lock and
                            vote with it.
                        </div>
                    )}
                </div>

                <div className="space-y-7">
                    <div>Relay</div>

                    <div className="flex w-full gap-3 bg-footer px-5 py-3 text-textgray md:items-center">
                        <span className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-textgray">
                            <FontAwesomeIcon icon={faInfo} size="xs" />
                        </span>
                        Relays are coming soon. Stay surfing.
                    </div>

                    {/* <div className="space-y-5 text-sm">
                        {Array.from({ length: 3 }).map((item, index) => {
                            return (
                                <div key={index}>
                                    <div className="flex flex-col gap-3 bg-footer p-5 md:pb-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="w-fit bg-black p-5">
                                                    <Image
                                                        src={Vector}
                                                        alt="vector"
                                                    />
                                                </div>
                                                <div>
                                                    <p>veMONI Maxi</p>
                                                    <p className="text-btn-primary underline">
                                                        Updated a day ago ·
                                                        0xc981...EF14f
                                                    </p>
                                                </div>
                                            </div>
                                            <Link href={"/lock/deposit"}>
                                                <Button
                                                    size="sm"
                                                    className="hidden md:block"
                                                >
                                                    Deposit Lock
                                                </Button>
                                            </Link>
                                        </div>

                                        <Divider className="bg-swapBox" />

                                        <div className="flex flex-col justify-between gap-5 text-textgray md:flex-row md:items-center md:gap-0">
                                            <div>
                                                Voting Power{" "}
                                                <span className="text-white">
                                                    22,358,450.56
                                                </span>{" "}
                                                ~ 3.55%
                                            </div>

                                            <div className="flex flex-col gap-5 md:flex-row md:gap-10">
                                                <p>
                                                    Reward{" "}
                                                    <span className="text-white">
                                                        MONI
                                                    </span>
                                                </p>
                                                <p>
                                                    APR{" "}
                                                    <span className="text-white">
                                                        63.23%
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            size="sm"
                                            className="block w-full md:hidden"
                                        >
                                            Deposit Lock
                                        </Button>
                                    </div>

                                    <div className="px-5">
                                        <div className="bg-brightBlack p-5">
                                            <div className="flex flex-col justify-between gap-3 bg-footer p-5 text-textgray md:flex-row md:gap-0">
                                                <p className="text-white">
                                                    Lock ID 12337
                                                </p>

                                                <p>
                                                    <span className="text-white">
                                                        35.41
                                                    </span>{" "}
                                                    MONI locked for 12 hours
                                                </p>

                                                <p>
                                                    <span className="text-white">
                                                        0.1 MONI
                                                    </span>{" "}
                                                    compounded
                                                </p>

                                                <p className="text-btn-primary underline">
                                                    Withdraw Lock
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div> */}
                </div>
            </div>
        </div>
    );
}
