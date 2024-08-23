"use client";

import BearIcon from "@/assets/images/Bera.png";
import MoniIcon from "@/assets/images/logo.svg";
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
import { FC } from "react";
import { ChipBadge } from "../ui/chipBadge";

type ModalProps = {
    isOpen: boolean;
    close: () => void;
};

export const IncentiveSelectModal: FC<ModalProps> = ({ isOpen, close }) => {
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
                                    <p>619 Liquidity Pools</p>
                                    <p>Has Deposit / Stake</p>
                                </div>

                                <Divider className="bg-swapBox" />

                                <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
                                    {Array.from({ length: 20 }).map(
                                        (item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between bg-brightBlack p-3"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="flex items-center">
                                                            <Image
                                                                src={BearIcon}
                                                                alt="icon"
                                                                width={30}
                                                            />
                                                            <Image
                                                                src={MoniIcon}
                                                                alt="icon"
                                                                width={30}
                                                                className="-translate-x-3"
                                                            />
                                                        </div>

                                                        <div>
                                                            <p>
                                                                vAMM-BERA/CAPPO
                                                            </p>
                                                            <ChipBadge>
                                                                Basic Stable ·
                                                                1.0%
                                                            </ChipBadge>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <p>---</p>
                                                        <p className="text-textlightgray">
                                                            $0.00
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
