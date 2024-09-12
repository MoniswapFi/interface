"use client";

import type { Pair } from "@/graphclient";
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { useGaugeCore } from "@/hooks/onchain/gauge";
import { useVoterCore } from "@/hooks/onchain/voting";
import { TokenType } from "@/types";
import { toSF } from "@/utils/format";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@nextui-org/react";
import Image from "next/image";
import { FC, MouseEventHandler, useMemo, useState } from "react";
import { formatUnits, zeroAddress } from "viem";
import { useWatchBlocks } from "wagmi";
import { ChipBadge } from "../ui/chipBadge";

type ModalProps = {
    isOpen: boolean;
    close: () => void;
    poolsList: Pair[];
    onItemClick: (pair: Pair) => any;
    selectedPair: Pair | null;
    tokenlist: TokenType[];
};

type TokenSelectableItemProps = {
    onSelect: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    item: Pair;
    tokenlist: TokenType[];
};

const TokenSelectableItem: FC<TokenSelectableItemProps> = ({
    onSelect,
    disabled,
    item,
    tokenlist,
}) => {
    const { usePoolFee } = useProtocolCore();
    const { data: fee = BigInt(0) } = usePoolFee(item.id as any, item.stable);
    const token0 = useMemo(
        () =>
            tokenlist.find(
                (token) =>
                    token.address.toLowerCase() ===
                    item.token0.id.toLowerCase(),
            ),
        [tokenlist, item.token0],
    );
    const token1 = useMemo(
        () =>
            tokenlist.find(
                (token) =>
                    token.address.toLowerCase() ===
                    item.token1.id.toLowerCase(),
            ),
        [tokenlist, item.token1],
    );

    const { usePoolTotalSupply } = usePoolMetadata(item.id as any);
    const { data: poolTotalSupply, refetch: refetchPoolSupply } =
        usePoolTotalSupply();
    const formattedTS = useMemo(
        () => Number(formatUnits(poolTotalSupply ?? BigInt(1), 18)),
        [poolTotalSupply],
    );

    const { useGetPoolGauge } = useVoterCore();

    const { data: gaugeId = zeroAddress, refetch: refetchGaugeId } =
        useGetPoolGauge(item.id);
    const { useGaugeReadables } = useGaugeCore();
    const { useTotalSupply } = useGaugeReadables(gaugeId);
    const { data: balanceInGauge = BigInt(0), refetch: refetchBalanceOf } =
        useTotalSupply();

    const formattedGaugeTS = useMemo(
        () => Number(formatUnits(balanceInGauge, 18)),
        [balanceInGauge],
    );

    useWatchBlocks({
        onBlock: async () => {
            await refetchPoolSupply();
            await refetchGaugeId();
            await refetchBalanceOf();
        },
    });

    return (
        <button
            disabled={disabled}
            onClick={onSelect}
            className="flex items-center justify-between bg-brightBlack p-3"
        >
            <div className="flex items-center">
                <div className="flex items-center">
                    <Image
                        src={token0?.logoURI ?? ""}
                        alt="icon"
                        width={30}
                        height={30}
                        className="rounded-full"
                    />
                    <Image
                        src={token1?.logoURI ?? ""}
                        alt="icon"
                        width={30}
                        height={30}
                        className="-translate-x-3 rounded-full"
                    />
                </div>

                <div>
                    <p>
                        {item.stable ? "sAMM" : "vAMM"}-{item.token0.symbol}/
                        {item.token1.symbol}
                    </p>
                    <ChipBadge>
                        Basic {item.stable ? "Stable" : "Volatile"} ·
                        {Number(fee ?? 0) / 100}%
                    </ChipBadge>
                </div>
            </div>

            <div className="text-right">
                <p>---</p>
                <p className="text-textlightgray">
                    $
                    {toSF(
                        (Number(item.reserveUSD) * formattedGaugeTS) /
                            formattedTS,
                    )}
                </p>
            </div>
        </button>
    );
};

export const IncentiveSelectModal: FC<ModalProps> = ({
    isOpen,
    close,
    poolsList,
    tokenlist,
    onItemClick,
    selectedPair,
}) => {
    const [searchValue, setSearchValue] = useState("");
    const filteredList = useMemo(
        () =>
            poolsList.filter(
                (pool) =>
                    pool.token0.name
                        .toLowerCase()
                        .startsWith(searchValue.toLowerCase()) ||
                    pool.token0.id
                        .toLowerCase()
                        .startsWith(searchValue.toLowerCase()) ||
                    pool.token0.symbol
                        .toLowerCase()
                        .startsWith(searchValue.toLowerCase()) ||
                    pool.token1.name
                        .toLowerCase()
                        .startsWith(searchValue.toLowerCase()) ||
                    pool.token1.id
                        .toLowerCase()
                        .startsWith(searchValue.toLowerCase()) ||
                    pool.token1.symbol
                        .toLowerCase()
                        .startsWith(searchValue.toLowerCase()),
            ),
        [poolsList, searchValue],
    );
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={close}
            classNames={{
                base: "bg-footer",
            }}
            backdrop="blur"
            placement="center"
            size="xl"
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="xs:text-2xl flex flex-col gap-1 pt-10 text-xl capitalize text-yellow1 sm:text-3xl">
                            select pool for incentives
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-5 pb-5">
                                <Input
                                    onChange={(ev) =>
                                        setSearchValue(ev.target.value)
                                    }
                                    placeholder="Search by name, symbol or address"
                                    radius="none"
                                    classNames={{
                                        base: "bg-transparent",
                                        inputWrapper:
                                            "bg-brightBlack group-data-[hover=true]:bg-brightBlack group-data-[focus=true]:bg-brightBlack",
                                        input: "!text-white",
                                    }}
                                    startContent={
                                        <FontAwesomeIcon
                                            icon={faSearch}
                                            className="text-swapBox"
                                        />
                                    }
                                />

                                <div className="flex justify-between">
                                    <p>{poolsList.length} Liquidity Pools</p>
                                    <p>Has Deposit / Stake</p>
                                </div>

                                <Divider className="bg-swapBox" />

                                <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
                                    {filteredList.map((item, index) => {
                                        return (
                                            <TokenSelectableItem
                                                tokenlist={tokenlist}
                                                key={index}
                                                onSelect={() =>
                                                    onItemClick(item)
                                                }
                                                item={item}
                                                disabled={
                                                    item.id.toLowerCase() ===
                                                    selectedPair?.id.toLowerCase()
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
