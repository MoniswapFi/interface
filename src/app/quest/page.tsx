"use client";

import { beraPackABI, bruvABI, smileebearsABI } from "@/assets/abis";
import AirdropImage from "@/assets/images/AirdropWeb.png";
import Rectangle from "@/assets/images/Rectangle_t.svg";
import RingIcon from "@/assets/images/ring.svg";
import StarIcon from "@/assets/images/star.svg";
import {
    __BERA_PACK__,
    __BRUV_BERAS__,
    __CHAIN_IDS__,
    __SMILEE_BERAS__,
} from "@/config/constants";
import { APP_URL } from "@/config/env";
import {
    useGetUserReferredCount,
    useGetUserVerifiedCount,
} from "@/hooks/api/leaderboard";
import { useCreateQuests, useGetUserQuestLists } from "@/hooks/api/quest";
import {
    useAddWalletPoints,
    useGetWallet,
    useGetWalletRank,
} from "@/hooks/api/wallet";
import {
    Accordion,
    AccordionItem,
    Checkbox,
    Divider,
    Tooltip,
} from "@nextui-org/react";
import { ethers } from "ethers";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { Button } from "../../components/ui/button";
import { LeaderBoardTable } from "./_components/LeaderBoardTable";

const pointsArray = [
    {
        title: "Follow Moniswap on X (Twitter) and turn on notification",
        points: 500,
        content: [
            "To pass this challenge, you must Follow Moniswap on X (Twitter) and turn on your notification.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Follow",
        key: "moniswap_x",
        href: "https://x.com/Moniswap_",
    },
    {
        title: "Follow Cappo on X (Twitter) and turn on notification",
        points: 500,
        content: [
            "To pass this challenge, you must Follow Cappo on X (Twitter) and turn on your notification.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Follow",
        key: "cappo_x",
        href: "https://x.com/Cappo_bera",
    },
    {
        title: "Follow Beraland on X (Twitter) and turn on notification",
        points: 500,
        content: [
            "To pass this challenge, you must Follow Beraland on X (Twitter) and turn on your notification.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update. ",
        ],
        button: "Follow",
        key: "beraland_x",
        href: "https://x.com/Bera_Land",
    },
    {
        title: "Follow BeraRoot on X and turn on notification",
        points: 500,
        content: [
            "To pass this challenge, you must Follow BeraRoot on X (Twitter) and turn on your notification.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Follow",
        key: "beraroot_x",
        href: "https://x.com/BeraRoot",
    },
    {
        title: "Follow Kingdomly on X and turn on notification",
        points: 500,
        content: [
            "To pass this challenge, you must Follow Kingdomly on X (Twitter) and turn on your notification.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Follow",
        key: "kingdomly_x",
        href: "https://x.com/KingdomlyApp",
    },
    {
        title: "Follow Bullas on X and turn on notification",
        points: 500,
        content: [
            "To pass this challenge, you must Follow Bullas on X (Twitter) and turn on your notification.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Follow",
        key: "bullas_x",
        href: "https://x.com/TheBullas_",
    },
    {
        title: "Follow Memeswap on X and turn on notification",
        points: 500,
        content: [
            "To pass this challenge, you must Follow Memeswap on X (Twitter) and turn on your notification.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Follow",
        key: "memeswap_x",
        href: "https://x.com/memeswapfi",
    },
    {
        title: "Join Moniswap Discord",
        points: 500,
        content: [
            "To pass this challenge, you must Join Moniswap's Discord server and engage with the community.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update. ",
        ],
        button: "Join Discord",
        key: "moniswap_discord",
        href: "https://discord.com/invite/enfBWYpNqw",
    },
    {
        title: "Join Beraland Discord",
        points: 500,
        content: [
            "To pass this challenge, you must Join Berachain's Discord server and engage with the community.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update. ",
        ],
        button: "Join Discord",
        key: "beraland_discord",
        href: "https://discord.gg/beraland",
    },
    {
        title: "Join BeraRoot Discord",
        points: 500,
        content: [
            "To pass this challenge, you must Join BeraRoot's Discord server and engage with the community.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update. ",
        ],
        button: "Join Discord",
        key: "beraRoot_discord",
        href: "https://discord.gg/beraroot",
    },
    {
        title: "Join Kingdomly Discord",
        points: 500,
        content: [
            "To pass this challenge, you must Join Kingdomly's Discord server and engage with the community.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update. ",
        ],
        button: "Join Discord",
        key: "kingdomly_discord",
        href: "https://discord.gg/kingdomly",
    },
    {
        title: "Join Bullas Discord",
        points: 500,
        content: [
            "To pass this challenge, you must Join Bullas's Discord server and engage with the community.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update. ",
        ],
        button: "Join Discord",
        key: "bullas_discord",
        href: "https://discord.gg/EY7GQQVm6v",
    },
    {
        title: "Join Memeswap Discord",
        points: 500,
        content: [
            "To pass this challenge, you must Join Memeswap's Discord server and engage with the community.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update. ",
        ],
        button: "Join Discord",
        key: "memeswap_discord",
        href: "https://discord.gg/ksCjFvuVFp",
    },
    {
        title: "Join Cappo Telegram group",
        points: 500,
        content: [
            "To pass this challenge, you must Join Cappo's Telegram group and communicate with fellow community members.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Join Telegram",
        key: "cappo_telegram",
        href: "https://t.me/Cappo_bera",
    },
    {
        title: "Join Moniswap Telegram group",
        points: 500,
        content: [
            "To pass this challenge, you must Join Moniswap's Telegram group and communicate with fellow community members.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Join Telegram",
        key: "moniswap_telegram",
        href: "https://t.me/Moniswap_Xyz",
    },
    {
        title: "Join Moniswap Telegram announcement",
        points: 500,
        content: [
            "To pass this challenge, you must Join Moniswap's Telegram announcement channel.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Join Telegram",
        key: "moniswap_announce_telegram",
        href: "https://t.me/Moniswap_News",
    },

    {
        title: "Trade on Moniswap",
        points: 1000,
        content: [
            "To pass this challenge, you must Participate in atleast 10 trading activities on the Moniswap platform.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Trade Now!",
        key: "trade",
        href: "/swap",
    },
    {
        title: "Provide Liquidity on Moniswap",
        points: 2000,
        content: [
            "To pass this challenge, you must Contribute liquidity to the Moniswap platform by providing assets to liquidity pools.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Add Liquidity",
        key: "liquidity",
        href: "/liquidity",
    },
    {
        title: "Hold Smilee Beras NFT",
        points: 10000,
        content: [
            "To pass this challenge, you must Hold Smilee Beras NFT.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Check",
        key: "smileeberas_pack",
        href: "https://opensea.io/collection/smilee-beras",
    },
    {
        title: "Hold Bruuvvprint NFT",
        points: 10000,
        content: [
            "To pass this challenge, you must Hold Bruuvvprint Beras NFT.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Check",
        key: "bruuvvprint_pack",
        href: "https://opensea.io/collection/bruuvvprint-memeswap",
    },
    {
        title: "Hold Bera Pack NFT",
        points: 20000,
        content: [
            "To pass this challenge, you must Hold Bera Pack NFT.",
            "Please note, we sync this challenge every hour so please be patient and your progress will automatically update.",
        ],
        button: "Check",
        key: "bera_pack",
        href: "https://www.kingdomly.app/bera-packs-",
    },
];

export default function Page() {
    const { isConnected, address } = useAccount();
    const [showToolTip, setShowToolTip] = useState(false);
    const [beraPackBalance, setBeraPackBalance] = useState(0);
    const [smileeberasBalance, setSmileeberasBalance] = useState(0);
    const [bruvBalance, setBruvBalance] = useState(0);

    const { data: wallet, refetch: refetchWallet } = useGetWallet({
        variables: {
            address: address as Address,
        },
    });

    const referralLink = `${APP_URL}/?referral=${wallet?.refCode || ""}`;

    const { data: questLists, refetch: refetchLists } = useGetUserQuestLists({
        variables: {
            address: address as Address,
        },
    });

    const { data: walletRank } = useGetWalletRank({
        variables: {
            address: address as Address,
        },
    });

    const { data: referredCount = 0 } = useGetUserReferredCount({
        variables: {
            address: address as Address,
        },
    });

    const { data: verifiedCount = 0 } = useGetUserVerifiedCount({
        variables: {
            address: address as Address,
        },
    });

    const { mutateAsync: createQuest } = useCreateQuests();
    const { mutateAsync: addWalletPoints } = useAddWalletPoints();

    const provider = new ethers.JsonRpcProvider("https://arb1.arbitrum.io/rpc");
    const berapackTokenContract = new ethers.Contract(
        __BERA_PACK__[__CHAIN_IDS__.arbi_mainnet],
        beraPackABI,
        provider,
    );
    const smileebearsTokenContract = new ethers.Contract(
        __SMILEE_BERAS__[__CHAIN_IDS__.arbi_mainnet],
        smileebearsABI,
        provider,
    );
    const bruvTokenContract = new ethers.Contract(
        __BRUV_BERAS__[__CHAIN_IDS__.arbi_mainnet],
        bruvABI,
        provider,
    );
    const getBerapackBalance = async () => {
        if (address) {
            const balance = await berapackTokenContract.balanceOf(address);
            setBeraPackBalance(balance);
        }
    };
    const getSmileeberasBalance = async () => {
        if (address) {
            const balance = await smileebearsTokenContract.balanceOf(address);
            setSmileeberasBalance(balance);
        }
    };
    const getBruvBalance = async () => {
        if (address) {
            const balance = await bruvTokenContract.balanceOf(address);
            setBruvBalance(balance);
        }
    };
    getBerapackBalance();
    getSmileeberasBalance();
    getBruvBalance();

    const claimPoints = async (key: string, points: number) => {
        try {
            await createQuest({
                address: address as Address,
                reason: key,
                points: points,
            });
            await addWalletPoints({
                address: address as Address,
                points: points,
            });
            refetchWallet();
            refetchLists();
        } catch (error) {
            console.debug(error);
        }
    };

    const handleClick = async (href: string, key: string, points: number) => {
        if (checkQuestStatus(key)) return false;
        window.open(href, "_blank");
        claimPoints(key, points);
    };

    const checkQuestStatus = useCallback(
        (key: string) => {
            if (!address || !questLists || questLists.length === 0)
                return false;
            const hasQuest = questLists?.some((item) => item.reason === key);
            return hasQuest;
        },
        [questLists, address],
    );

    const handleMint = (key: string, href: string) => {
        if (!address) return false;
        if (key === "bera_pack" && beraPackBalance) return false;
        if (key === "smileeberas_pack" && smileeberasBalance) return false;
        window.open(href, "_blank");
    };

    const handleCopyLink = async () => {
        if (!isConnected) return;
        await navigator.clipboard.writeText(referralLink);
        setShowToolTip(true);

        setTimeout(() => {
            setShowToolTip(false);
        }, 2000);
    };

    const handleSendEmail = () => {
        if (!isConnected) return;
        const mailtoLink = `mailto:?&body=${referralLink}`;
        window.open(mailtoLink, "_blank");
    };

    const handlePostOnTwitter = () => {
        if (!isConnected) return;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(referralLink)}`;
        window.open(twitterUrl, "_blank");
    };

    const renderNFTButtonText = (balance: number, confirmText: string) =>
        balance ? "Confirmed" : `${confirmText} now!`;

    useEffect(() => {
        if (beraPackBalance && address && questLists) {
            if (!checkQuestStatus("bera_pack")) claimPoints("bera_pack", 20000);
        }
        if (smileeberasBalance && address && questLists) {
            if (!checkQuestStatus("smileeberas_pack"))
                claimPoints("smileeberas_pack", 10000);
        }
        if (bruvBalance && address && questLists) {
            if (!checkQuestStatus("bruuvvprint_pack"))
                claimPoints("bruuvvprint_pack", 10000);
        }
    }, [beraPackBalance, smileeberasBalance, bruvBalance, address, questLists]);

    return (
        <div className="relative space-y-5 overflow-hidden p-5 lg:px-20">
            <Image
                alt="image"
                src={Rectangle}
                width={200}
                height={200}
                className="absolute right-[-100px] top-[-100px] lg:right-[-70px] lg:top-[-70px]"
            />
            <div className="flex flex-col-reverse gap-3 pt-5 lg:flex-row">
                <div className="flex-1 space-y-5 lg:pt-32">
                    <div className="lg:space-y-5">
                        <h1 className="text-2xl lg:text-5xl">
                            Join Moniswap Airdrop Campaign{" "}
                            <span className="w-full bg-gradient-to-r from-btn-primary to-gold bg-clip-text text-transparent">
                                Quest
                            </span>
                        </h1>

                        <p className="text-swapBox">
                            Complete both off-chain and on-chain quests to earn
                            points. The more points you accumulate, the greater
                            the rewards you will collect.
                        </p>
                    </div>

                    <div className="space-y-3 bg-brightBlack p-5 lg:max-w-[450px]">
                        <div className="flex gap-3">
                            <Image src={RingIcon} alt="RingIcon" />
                            <p>
                                {isConnected ? <>{wallet?.points}</> : "N/A"}{" "}
                                <span className="text-gray1">points</span>
                            </p>
                        </div>
                        <Divider className="bg-gray2" />
                        <div className="flex gap-3">
                            <Image src={StarIcon} alt="RingIcon" />
                            <span className="text-gray1">
                                Ranked #
                                {walletRank && walletRank.rank
                                    ? walletRank.rank
                                    : "N/A"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <Image
                        src={AirdropImage}
                        alt="airdrop image"
                        className="m-auto"
                    />
                </div>
            </div>

            <div className="bg-brightBlack px-3 py-5">
                <Accordion variant="splitted">
                    {pointsArray.map((item, index) => {
                        return (
                            <AccordionItem
                                key={index}
                                aria-label={item.title}
                                title={
                                    <div className="flex items-center justify-between gap-2 text-xs lg:text-base">
                                        <div className="flex items-center">
                                            <Checkbox
                                                size="lg"
                                                radius="full"
                                                color="warning"
                                                classNames={{
                                                    icon: "text-white",
                                                    base: "data-[disabled=true]:opacity-100",
                                                }}
                                                isDisabled
                                                isSelected={checkQuestStatus(
                                                    item.key,
                                                )}
                                            />
                                            {item.title}
                                        </div>
                                        <div className="flex-shrink-0">
                                            +{item.points} points
                                        </div>
                                    </div>
                                }
                                classNames={{
                                    base: "!bg-darkBlack !rounded-none",
                                    title: "text-white",
                                }}
                            >
                                <div className="space-y-5">
                                    {item.content?.map((text, index) => {
                                        return (
                                            <p
                                                className="text-xs text-gray1 lg:text-base"
                                                key={index}
                                            >
                                                {text}
                                            </p>
                                        );
                                    })}

                                    {item.key === "bera_pack" ||
                                    item.key === "smileeberas_pack" ||
                                    item.key === "bruuvvprint_pack" ? (
                                        <>
                                            <Button
                                                variant="primary"
                                                size="full"
                                                classNames={{
                                                    base: "text-gray",
                                                }}
                                                disabled={checkQuestStatus(
                                                    item.key,
                                                )}
                                                onClick={() =>
                                                    handleMint(
                                                        item.key,
                                                        item.href,
                                                    )
                                                }
                                            >
                                                {item.key === "bera_pack"
                                                    ? renderNFTButtonText(
                                                          beraPackBalance,
                                                          "Mint",
                                                      )
                                                    : item.key ===
                                                        "bruuvvprint_pack"
                                                      ? renderNFTButtonText(
                                                            bruvBalance,
                                                            "Buy",
                                                        )
                                                      : renderNFTButtonText(
                                                            smileeberasBalance,
                                                            "Buy",
                                                        )}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="primary"
                                                size="full"
                                                onClick={() =>
                                                    handleClick(
                                                        item.href,
                                                        item.key,
                                                        item.points,
                                                    )
                                                }
                                                classNames={{
                                                    base: "text-gray",
                                                }}
                                                disabled={checkQuestStatus(
                                                    item.key,
                                                )}
                                            >
                                                {checkQuestStatus(item.key) ? (
                                                    "Confirmed"
                                                ) : (
                                                    <>{item?.button}</>
                                                )}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </div>

            <div className="space-y-3 bg-brightBlack p-5">
                <p className="text-2xl">
                    Refer a Friend to Multiply your Score!
                </p>

                <p className="text-sm text-gray1">
                    When your friends sign up and onboard via your referral
                    link, you both increase the multiplier on your score.
                </p>

                <p className="text-sm text-gray1">
                    You&apos;ve already referred {referredCount} new users, of
                    these {verifiedCount} new users are counted to your referral
                    multiple. After your next referral, your new score
                    multiplier will be 2x and your total points will increase to
                    400!
                </p>

                <div className="border border-lightGray p-3 text-sm">
                    {referralLink}
                </div>

                <div className="w-full gap-3 space-y-3 lg:flex lg:space-y-0">
                    <Tooltip
                        content="Link copied!"
                        showArrow={true}
                        isOpen={showToolTip}
                        shadow="md"
                        classNames={{
                            base: "before:bg-black",
                            content: "bg-black rounded-none",
                            arrow: "bg-black",
                        }}
                    >
                        <Button
                            classNames={{
                                wrapper: "w-full",
                                base: "w-full text-sm text-gray1",
                            }}
                            onClick={handleCopyLink}
                        >
                            Copy referral link
                        </Button>
                    </Tooltip>

                    <Button
                        classNames={{
                            wrapper: "w-full",
                            base: "w-full text-sm text-gray1",
                        }}
                        onClick={handleSendEmail}
                    >
                        Send as email
                    </Button>
                    <Button
                        classNames={{
                            wrapper: "w-full",
                            base: "w-full text-sm text-gray1",
                        }}
                        onClick={handlePostOnTwitter}
                    >
                        Post on X (Twitter)
                    </Button>
                </div>
            </div>

            <LeaderBoardTable />
        </div>
    );
}
