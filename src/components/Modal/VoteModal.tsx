"use client";

import BearIcon from "@/assets/images/Bera.png";
import MoniIcon from "@/assets/images/logo.svg";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import Image from "next/image";
import { FC } from "react";
import { Popover } from "../ui/Popover";

type Props = {
    isOpen: boolean;
    close: () => void;
};

export const VoteModal: FC<Props> = ({ isOpen, close }) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={close}
            backdrop="blur"
            classNames={{
                base: "bg-footer",
            }}
            hideCloseButton
            placement="center"
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader></ModalHeader>
                        <ModalBody className="space-y-2 px-2 pb-5">
                            <div>
                                <div className="relative flex items-center justify-between bg-nightRider p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-fit bg-neroBlack p-3">
                                            <Image
                                                alt="icon"
                                                src={MoniIcon}
                                                className="w-[20px]"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[10px]">
                                                Lock ID 12337
                                            </p>
                                            <p className="text-[8px] text-gray1">
                                                35.41 MONI locked for 18 hours
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-right text-[10px]">
                                        <p>Total Voting Power</p>
                                        <p className="text-green2">
                                            100.0% Available
                                        </p>
                                    </div>

                                    <div className="absolute right-[-5px] top-[-10px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white p-2">
                                        <FontAwesomeIcon
                                            icon={faXmark}
                                            className="text-xs text-black"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-5">
                                <div className="w-[40%]">
                                    <div className="relative flex w-full items-center gap-1">
                                        <div className="flex items-center">
                                            <Image
                                                src={BearIcon}
                                                alt="icon"
                                                width={20}
                                            />
                                            <Image
                                                src={MoniIcon}
                                                alt="icon"
                                                width={20}
                                                className="-translate-x-1"
                                            />
                                        </div>

                                        <div className="">
                                            <p className="text-[10px]">
                                                vAMM-WETH/USDC
                                            </p>
                                            <div className="text-[8px]">
                                                <span className="text-lightblue">
                                                    Volatile Pool · 0.3%{" "}
                                                </span>
                                                <Popover content="Deposit rate." />
                                            </div>
                                        </div>

                                        <div className="absolute right-[-5px] top-[-10px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white p-2">
                                            <FontAwesomeIcon
                                                icon={faXmark}
                                                className="text-xs text-black"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2 text-[8px]">
                                        <div className="space-x-1">
                                            <span className="text-brightGray">
                                                Votes
                                            </span>
                                            <span className="text-gray1">
                                                14,469,842.01
                                            </span>
                                        </div>

                                        <div className="space-x-1">
                                            <span className="text-brightGray">
                                                Total Rewards
                                            </span>
                                            <span className="text-gray1">
                                                ~$104,704.27
                                            </span>
                                        </div>
                                        <div className="space-x-1">
                                            <span className="text-brightGray">
                                                Voting
                                            </span>
                                            <span className="text-gray1">
                                                APR 127.31%
                                            </span>
                                        </div>

                                        <div className="!mt-5 space-y-2">
                                            <div className="text-brightGray">
                                                Est. Rewards
                                            </div>
                                            <div className="text-gray1">
                                                3~$0.0
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-[60%] space-y-3">
                                    <div className="grid grid-cols-2 text-[10px]">
                                        <div className="flex flex-col justify-center gap-1 px-3 text-right">
                                            <p className="text-brightGray">
                                                Voting Power
                                            </p>
                                            <p className="text-gray1">
                                                0.0 veMONI
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-center bg-nightRider py-3">
                                            % 0.00
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-1 text-[8px] text-gray1">
                                        <div className="w-fit bg-darkgray px-2 py-1">
                                            0%
                                        </div>
                                        <div className="w-fit bg-darkgray px-2 py-1">
                                            10%
                                        </div>
                                        <div className="w-fit bg-darkgray px-2 py-1">
                                            25%
                                        </div>
                                        <div className="w-fit bg-darkgray px-2 py-1">
                                            50%
                                        </div>
                                        <div className="w-fit bg-darkgray px-2 py-1">
                                            75%
                                        </div>
                                        <div className="w-fit bg-darkgray px-2 py-1">
                                            100%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
