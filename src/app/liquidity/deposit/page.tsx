"use client";

import { Button } from "@/components/ui/button";
import { ChipBadge } from "@/components/ui/chipBadge";
import { __ETHER__, __WRAPPED_ETHER__ } from "@/config/constants";
import { useGetTokenLists } from "@/hooks/api/tokens";
import { useSinglePoolInfo } from "@/hooks/graphql/core";
import { useTimeInMotion } from "@/hooks/misc";
import { useProtocolCore } from "@/hooks/onchain/core";
import { TokenType } from "@/types";
import { toSF } from "@/utils/format";
import { faInfo, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { zeroAddress } from "viem";
import { useChainId, useWatchBlocks } from "wagmi";
import { Deposit } from "../_components/Deposit";

export default function Page() {
    const [showDepositComponent, setShowDepositComponent] = useState(false);
    const [isStableDeposit, setIsStableDeposit] = useState(false);
    const { data: tokenLists = [] } = useGetTokenLists({});
    const [selectedTokens, setSelectedTokens] = useState<
        [TokenType | null, TokenType | null]
    >([null, null]);

    const chainId = useChainId();
    const wrappedEther = useMemo(() => __WRAPPED_ETHER__[chainId], [chainId]);
    const firstAddress = useMemo(
        () =>
            selectedTokens[0]?.address === __ETHER__
                ? wrappedEther
                : selectedTokens[0]?.address,
        [wrappedEther, selectedTokens[0]?.address],
    );
    const secondAddress = useMemo(
        () =>
            selectedTokens[1]?.address === __ETHER__
                ? wrappedEther
                : selectedTokens[1]?.address,
        [wrappedEther, selectedTokens[1]?.address],
    );
    const { useGetPool, usePoolFee, useStableFee, useVolatileFee } =
        useProtocolCore();
    const { data: stablePoolAddress, refetch: refetchStablePool } = useGetPool(
        (firstAddress as any) ?? zeroAddress,
        (secondAddress as any) ?? zeroAddress,
        true,
    );
    const { data: volatilePoolAddress, refetch: refetchVolatilePool } =
        useGetPool(
            (firstAddress as any) ?? zeroAddress,
            (secondAddress as any) ?? zeroAddress,
            false,
        );

    const useStablePoolQuery = useSinglePoolInfo(
        stablePoolAddress?.toLowerCase(),
    );
    const { data: stablePool } = useStablePoolQuery();

    const useVolatilePoolQuery = useSinglePoolInfo(
        volatilePoolAddress?.toLowerCase(),
    );
    const { data: volatilePool } = useVolatilePoolQuery();

    const timeInMotion = useTimeInMotion();

    const { data: fee0 } = usePoolFee(stablePoolAddress as any, true);
    const { data: fee1 } = usePoolFee(volatilePoolAddress as any, true);

    const { data: stableFee } = useStableFee();
    const { data: volatileFee } = useVolatileFee();

    useWatchBlocks({
        onBlock: async () => {
            await refetchStablePool();
            await refetchVolatilePool();
        },
    });

    return (
        <>
            {!showDepositComponent ? (
                <div className="mx-auto flex max-w-[1300px] flex-col gap-10 px-5 pb-10 pt-10 md:pt-20 lg:pt-36">
                    <p className="text-2xl">Deposit Liquidity</p>

                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                        <div className="flex flex-1 flex-col gap-5 bg-footer p-5">
                            <span className="capitalize">first token</span>
                            <Select
                                label="Select Token"
                                className="max-w-xs"
                                radius="none"
                                classNames={{
                                    trigger:
                                        "bg-transparent data-[hover=true]:bg-transparent border border-swapBox",
                                    listbox: "bg-footer",
                                    listboxWrapper: "bg-footer",
                                    popoverContent:
                                        "p-0 bg-footer border rounded-none border-swapBox",
                                    label: "hidden",
                                    base: "!m-0 !max-w-full",
                                    value: "!text-white",
                                }}
                                labelPlacement="outside"
                            >
                                {tokenLists.map((token, index) => {
                                    return (
                                        <SelectItem
                                            isReadOnly={
                                                selectedTokens[0] === token ||
                                                selectedTokens[1] === token
                                            }
                                            onPress={() =>
                                                setSelectedTokens([
                                                    token,
                                                    selectedTokens[1],
                                                ])
                                            }
                                            key={index}
                                            classNames={{
                                                base: "data-[selectable=true]:bg-footer data-[hover=true]:bg-footer data-[hover=true]:text-white",
                                            }}
                                            startContent={
                                                <Avatar src={token.logoURI} />
                                            }
                                        >
                                            {token.symbol}
                                        </SelectItem>
                                    );
                                })}
                            </Select>
                        </div>

                        <div className="flex flex-1 flex-col gap-5 bg-footer p-5">
                            <span className="capitalize">second token</span>

                            <Select
                                label="Select Token"
                                className="max-w-xs"
                                radius="none"
                                classNames={{
                                    trigger:
                                        "bg-transparent data-[hover=true]:bg-transparent border border-swapBox",
                                    listbox: "bg-footer",
                                    listboxWrapper: "bg-footer",
                                    popoverContent:
                                        "p-0 bg-footer border rounded-none border-swapBox",
                                    label: "hidden",
                                    base: "!m-0 !max-w-full",
                                    value: "!text-white",
                                }}
                                labelPlacement="outside"
                            >
                                {tokenLists.map((token, index) => {
                                    return (
                                        <SelectItem
                                            isReadOnly={
                                                selectedTokens[0] === token ||
                                                selectedTokens[1] === token
                                            }
                                            key={index}
                                            onPress={() =>
                                                setSelectedTokens([
                                                    selectedTokens[0],
                                                    token,
                                                ])
                                            }
                                            classNames={{
                                                base: "data-[selectable=true]:bg-footer data-[hover=true]:bg-footer data-[hover=true]:text-white",
                                            }}
                                            startContent={
                                                <Avatar src={token.logoURI} />
                                            }
                                        >
                                            {token.symbol}
                                        </SelectItem>
                                    );
                                })}
                            </Select>
                        </div>
                    </div>

                    {(selectedTokens[0] === null ||
                        selectedTokens[1] === null) && (
                        <div className="flex gap-3 bg-footer px-5 py-3 text-textgray md:items-center">
                            <span className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-textgray">
                                <FontAwesomeIcon icon={faInfo} size="xs" />
                            </span>
                            Start by selecting the tokens. The liquidity pools
                            available for deposit will show up next.
                        </div>
                    )}

                    <div className="flex flex-col gap-5">
                        <h5>Available Pools</h5>
                        {(!!stablePoolAddress || !!volatilePoolAddress) &&
                        (stablePoolAddress !== zeroAddress ||
                            volatilePoolAddress !== zeroAddress) &&
                        selectedTokens[0] !== null &&
                        selectedTokens[1] !== null ? (
                            <>
                                {!!stablePool && (
                                    <div className="bg-footer p-5">
                                        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:gap-0">
                                            <div className="flex items-center">
                                                <div className="flex items-center">
                                                    <Image
                                                        src={
                                                            selectedTokens[0]
                                                                .logoURI
                                                        }
                                                        alt="icon"
                                                        width={30}
                                                        height={30}
                                                        className="rounded-full"
                                                    />
                                                    <Image
                                                        src={
                                                            selectedTokens[1]
                                                                .logoURI
                                                        }
                                                        alt="icon"
                                                        width={30}
                                                        height={30}
                                                        className="-translate-x-3 rounded-full"
                                                    />
                                                </div>

                                                <div>
                                                    <span>
                                                        sAMM-
                                                        {
                                                            stablePool.token0
                                                                .symbol
                                                        }
                                                        /
                                                        {
                                                            stablePool.token1
                                                                .symbol
                                                        }
                                                    </span>
                                                    <ChipBadge>
                                                        Basic Stable ·{" "}
                                                        {Number(fee0 ?? 0) /
                                                            100}
                                                        %
                                                    </ChipBadge>
                                                </div>
                                            </div>

                                            <div className="flex justify-between lg:flex-col lg:text-right">
                                                <p className="text-textgray">
                                                    TVL
                                                </p>
                                                <p>
                                                    $
                                                    {toSF(stablePool.volumeUSD)}
                                                </p>
                                            </div>

                                            <div className="flex justify-between lg:flex-col lg:text-right">
                                                <p className="text-textgray">
                                                    Fees
                                                </p>
                                                <p>
                                                    ${toSF(stablePool.feesUSD)}
                                                </p>
                                            </div>

                                            <div className="flex justify-between lg:flex-col lg:text-right">
                                                <p className="text-textgray">
                                                    Volume (24H)
                                                </p>
                                                <p>
                                                    $
                                                    {toSF(
                                                        stablePool.pairHourData?.findLast(
                                                            (p) =>
                                                                timeInMotion -
                                                                    p.hourStartUnix <=
                                                                24,
                                                        )?.hourlyVolumeUSD,
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <Button
                                                    onClick={() => {
                                                        setIsStableDeposit(
                                                            true,
                                                        );
                                                        setShowDepositComponent(
                                                            true,
                                                        );
                                                    }}
                                                    className="w-full min-w-0 text-btn-primary"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                    />{" "}
                                                    <span className="lg:hidden">
                                                        Add Liquidity
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!!volatilePool && (
                                    <div className="bg-footer p-5">
                                        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:gap-0">
                                            <div className="flex items-center">
                                                <div className="flex items-center">
                                                    <Image
                                                        src={
                                                            selectedTokens[0]
                                                                .logoURI
                                                        }
                                                        alt="icon"
                                                        width={30}
                                                        height={30}
                                                        className="rounded-full"
                                                    />
                                                    <Image
                                                        src={
                                                            selectedTokens[1]
                                                                .logoURI
                                                        }
                                                        alt="icon"
                                                        width={30}
                                                        height={30}
                                                        className="-translate-x-3 rounded-full"
                                                    />
                                                </div>

                                                <div>
                                                    <span>
                                                        vAMM-
                                                        {
                                                            volatilePool.token0
                                                                .symbol
                                                        }
                                                        /
                                                        {
                                                            volatilePool.token1
                                                                .symbol
                                                        }
                                                    </span>
                                                    <ChipBadge>
                                                        Basic Volatile ·{" "}
                                                        {Number(fee1 ?? 0) /
                                                            100}
                                                        %
                                                    </ChipBadge>
                                                </div>
                                            </div>

                                            <div className="flex justify-between lg:flex-col lg:text-right">
                                                <p className="text-textgray">
                                                    TVL
                                                </p>
                                                <p>
                                                    $
                                                    {toSF(
                                                        volatilePool.volumeUSD,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex justify-between lg:flex-col lg:text-right">
                                                <p className="text-textgray">
                                                    Fees
                                                </p>
                                                <p>
                                                    $
                                                    {toSF(volatilePool.feesUSD)}
                                                </p>
                                            </div>

                                            <div className="flex justify-between lg:flex-col lg:text-right">
                                                <p className="text-textgray">
                                                    Volume (24H)
                                                </p>
                                                <p>
                                                    $
                                                    {toSF(
                                                        volatilePool.pairHourData?.findLast(
                                                            (p) =>
                                                                timeInMotion -
                                                                    p.hourStartUnix <=
                                                                24,
                                                        )?.hourlyVolumeUSD ?? 0,
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <Button
                                                    onClick={() => {
                                                        setIsStableDeposit(
                                                            false,
                                                        );
                                                        setShowDepositComponent(
                                                            true,
                                                        );
                                                    }}
                                                    className="w-full min-w-0 text-btn-primary"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPlus}
                                                    />{" "}
                                                    <span className="lg:hidden">
                                                        Add Liquidity
                                                    </span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex gap-3 bg-footer px-5 py-3 text-textgray md:items-center">
                                <span className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-textgray">
                                    <FontAwesomeIcon icon={faInfo} size="xs" />
                                </span>
                                There are no available liquidity pools. Try
                                supplying liquidity to low LPs.
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-5">
                        <h5>Low Liquidity Pools</h5>
                        <div className="flex w-full flex-col gap-2">
                            {(!volatilePool || !stablePool) &&
                            selectedTokens[0] !== null &&
                            selectedTokens[1] !== null ? (
                                <>
                                    {!volatilePool &&
                                        selectedTokens[0] !== null &&
                                        selectedTokens[1] !== null && (
                                            <div className="bg-footer p-5">
                                                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:gap-0">
                                                    <div className="flex items-center">
                                                        <div className="flex items-center">
                                                            <Image
                                                                src={
                                                                    selectedTokens[0]
                                                                        .logoURI
                                                                }
                                                                alt="icon"
                                                                width={30}
                                                                height={30}
                                                                className="rounded-full"
                                                            />
                                                            <Image
                                                                src={
                                                                    selectedTokens[1]
                                                                        .logoURI
                                                                }
                                                                alt="icon"
                                                                width={30}
                                                                height={30}
                                                                className="-translate-x-3 rounded-full"
                                                            />
                                                        </div>

                                                        <div>
                                                            <p>
                                                                vAMM-
                                                                {
                                                                    selectedTokens[0]
                                                                        .symbol
                                                                }
                                                                /
                                                                {
                                                                    selectedTokens[1]
                                                                        .symbol
                                                                }
                                                            </p>
                                                            <ChipBadge>
                                                                Basic Volatile ·{" "}
                                                                {Number(
                                                                    volatileFee ??
                                                                        0,
                                                                ) / 100}
                                                                %
                                                            </ChipBadge>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between lg:flex-col lg:text-right">
                                                        <p className="text-textgray">
                                                            TVL
                                                        </p>
                                                        <p>$0.00</p>
                                                    </div>

                                                    <div className="flex justify-between lg:flex-col lg:text-right">
                                                        <p className="text-textgray">
                                                            Fees (24H)
                                                        </p>
                                                        <p>$0.00</p>
                                                    </div>

                                                    <div className="flex justify-between lg:flex-col lg:text-right">
                                                        <p className="text-textgray">
                                                            Volume (24H)
                                                        </p>
                                                        <p>$0.00</p>
                                                    </div>

                                                    <div>
                                                        <Button
                                                            onClick={() => {
                                                                setIsStableDeposit(
                                                                    false,
                                                                );
                                                                setShowDepositComponent(
                                                                    true,
                                                                );
                                                            }}
                                                            className="w-full min-w-0 text-btn-primary"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faPlus}
                                                            />{" "}
                                                            <span className="lg:hidden">
                                                                Add Liquidity
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {!stablePool &&
                                        selectedTokens[0] !== null &&
                                        selectedTokens[1] !== null && (
                                            <div className="bg-footer p-5">
                                                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:gap-0">
                                                    <div className="flex items-center">
                                                        <div className="flex items-center">
                                                            <Image
                                                                src={
                                                                    selectedTokens[0]
                                                                        .logoURI
                                                                }
                                                                alt="icon"
                                                                width={30}
                                                                height={30}
                                                                className="rounded-full"
                                                            />
                                                            <Image
                                                                src={
                                                                    selectedTokens[1]
                                                                        .logoURI
                                                                }
                                                                alt="icon"
                                                                width={30}
                                                                height={30}
                                                                className="-translate-x-3 rounded-full"
                                                            />
                                                        </div>

                                                        <div>
                                                            <p>
                                                                sMM-
                                                                {
                                                                    selectedTokens[0]
                                                                        .symbol
                                                                }
                                                                /
                                                                {
                                                                    selectedTokens[1]
                                                                        .symbol
                                                                }
                                                            </p>
                                                            <ChipBadge>
                                                                Basic Stable ·{" "}
                                                                {Number(
                                                                    stableFee ??
                                                                        0,
                                                                ) / 100}
                                                                %
                                                            </ChipBadge>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between lg:flex-col lg:text-right">
                                                        <p className="text-textgray">
                                                            TVL
                                                        </p>
                                                        <p>$0.00</p>
                                                    </div>

                                                    <div className="flex justify-between lg:flex-col lg:text-right">
                                                        <p className="text-textgray">
                                                            Fees (24H)
                                                        </p>
                                                        <p>$0.00</p>
                                                    </div>

                                                    <div className="flex justify-between lg:flex-col lg:text-right">
                                                        <p className="text-textgray">
                                                            Volume (24H)
                                                        </p>
                                                        <p>$0.00</p>
                                                    </div>

                                                    <div>
                                                        <Button
                                                            onClick={() => {
                                                                setIsStableDeposit(
                                                                    true,
                                                                );
                                                                setShowDepositComponent(
                                                                    true,
                                                                );
                                                            }}
                                                            className="w-full min-w-0 text-btn-primary"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={faPlus}
                                                            />{" "}
                                                            <span className="lg:hidden">
                                                                Add Liquidity
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </>
                            ) : (
                                <div className="flex gap-3 bg-footer px-5 py-3 text-textgray md:items-center">
                                    <span className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-textgray">
                                        <FontAwesomeIcon
                                            icon={faInfo}
                                            size="xs"
                                        />
                                    </span>
                                    There are no available low LPs. Add to
                                    available ones instead.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <Deposit
                    token0={selectedTokens[0]!}
                    token1={selectedTokens[1]!}
                    stable={isStableDeposit}
                />
            )}
        </>
    );
}
