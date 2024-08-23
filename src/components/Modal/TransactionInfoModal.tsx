"use client";

import TXFailedImage from "@/assets/images/tx_failed.svg";
import TXSuccessImage from "@/assets/images/tx_success.svg";
import {
    cn,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Button } from "../ui/button";

type Props = {
    isOpen: boolean;
    close: () => void;
    type: "success" | "failure";
    txHash?: string;
};

export const TransactionInfoModal: FC<Props> = ({
    isOpen,
    close,
    type = "success",
    txHash,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={close}
            backdrop="blur"
            classNames={{
                base: "bg-footer",
            }}
            placement="center"
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader></ModalHeader>
                        <ModalBody className="flex flex-col items-center pb-5">
                            {type === "success" ? (
                                <Image
                                    alt="image"
                                    src={TXSuccessImage}
                                    className="w-[150px]"
                                />
                            ) : (
                                <Image
                                    alt="image"
                                    src={TXFailedImage}
                                    className="w-[150px]"
                                />
                            )}
                            <div
                                className={cn(
                                    "text-center text-4xl uppercase",
                                    {
                                        "text-yellow1": type === "success",
                                        "text-text-error": type !== "success",
                                    },
                                )}
                            >
                                <p>Transaction</p>
                                {type === "success" ? (
                                    <span>Successful</span>
                                ) : (
                                    <span>ERROR</span>
                                )}
                            </div>

                            {txHash && (
                                <Link
                                    href={`https://bartio.beratrail.io/tx/${txHash}`}
                                    target="_blank"
                                    className="uppercase underline"
                                >
                                    View on explorer
                                </Link>
                            )}

                            <Button
                                className="w-full"
                                variant="primary"
                                classNames={{
                                    wrapper: "w-full",
                                }}
                                onClick={close}
                            >
                                CLOSE
                            </Button>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
