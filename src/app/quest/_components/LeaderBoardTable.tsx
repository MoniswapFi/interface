"use client";

import { useGetAllWallet, useGetWalletRank, Wallet } from "@/hooks/api/wallet";
import { truncateAddress } from "@/utils/format";
import {
    cn,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

export const LeaderBoardTable = () => {
    const { address } = useAccount();
    const [firstLists, setFirstLists] = useState<Wallet[]>([]);
    const [secondLists, setSecondLists] = useState<Wallet[]>([]);
    const { data: walletRank } = useGetWalletRank({
        variables: {
            address: address as Address,
        },
    });

    const { data: allWallets = [] } = useGetAllWallet();

    useEffect(() => {
        if (walletRank?.rank) {
            if (allWallets.length > 11 && walletRank.rank > 8) {
                setFirstLists(allWallets.slice(0, 5));
                setSecondLists(
                    allWallets.slice(
                        walletRank.rank - 3,
                        walletRank.rank - 3 + 5,
                    ),
                );
            } else {
                setFirstLists(allWallets.slice(0, 10));
            }
        }
    }, [allWallets.length, walletRank?.rank]);

    console.log(secondLists);

    return (
        <div className="space-y-3 bg-brightBlack p-5">
            <div className="flex flex-col items-start justify-between gap-2 lg:flex-row">
                <div>
                    <p className="text-lg lg:text-2xl">The Leaderboard</p>
                    <p className="text-xs text-gray1 lg:text-sm">
                        Compete to get the highest score, you can do it!
                    </p>
                </div>
                <p className="text-base lg:text-xl">
                    You are ranked{" "}
                    {walletRank && walletRank.rank ? walletRank.rank : "N/A"} of{" "}
                    {allWallets?.length} participants
                </p>
            </div>

            <div>
                <Table
                    aria-label="ranking table"
                    removeWrapper
                    classNames={{
                        th: "bg-darkBlack text-white text-balance",
                        tr: "h-[50px]",
                        tbody: "text-gray1",
                        td: "break-words",
                    }}
                >
                    <TableHeader>
                        <TableColumn className="text-center">#</TableColumn>
                        <TableColumn>NAME</TableColumn>
                        <TableColumn>Verified Referral Multiplier</TableColumn>
                        <TableColumn>Total Score</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {firstLists.map((wallet, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    className={cn("", {
                                        "bg-btn-primary":
                                            wallet.address === address,
                                    })}
                                >
                                    <TableCell className="w-[60px] text-center max-md:px-1 md:w-[100px]">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="w-[120px] md:w-[200px]">
                                        {truncateAddress(wallet.address)}
                                    </TableCell>
                                    <TableCell>346x</TableCell>
                                    <TableCell className="w-[80px] md:w-[200px]">
                                        {wallet.points} points
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {allWallets.length > 11 &&
                    walletRank &&
                    walletRank.rank > 8 && (
                        <>
                            <div className="text-center">
                                {walletRank.rank - 8} other participants
                            </div>

                            <Table
                                aria-label="ranking table"
                                removeWrapper
                                hideHeader
                                classNames={{
                                    th: "bg-darkBlack text-white text-balance",
                                    tr: "h-[50px]",
                                    tbody: "text-gray1",
                                    td: "break-words",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn>#</TableColumn>
                                    <TableColumn>NAME</TableColumn>
                                    <TableColumn>
                                        Verified Referral Multiplier
                                    </TableColumn>
                                    <TableColumn>Total Score</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {secondLists.map((wallet, index) => {
                                        return (
                                            <TableRow
                                                key={index}
                                                className={cn("", {
                                                    "bg-btn-primary":
                                                        wallet.address ===
                                                        address,
                                                })}
                                            >
                                                <TableCell className="w-[60px] text-center max-md:px-1 md:w-[100px]">
                                                    {index +
                                                        walletRank?.rank -
                                                        2}
                                                </TableCell>
                                                <TableCell className="w-[120px] md:w-[200px]">
                                                    {truncateAddress(
                                                        wallet.address,
                                                    )}
                                                </TableCell>
                                                <TableCell>346x</TableCell>
                                                <TableCell className="w-[80px] md:w-[200px]">
                                                    {wallet.points} points
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </>
                    )}
            </div>
        </div>
    );
};
