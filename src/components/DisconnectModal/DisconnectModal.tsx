import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { FC } from "react";
import { useDisconnect } from "wagmi";

type ModalProps = {
    isOpen: boolean;
    close: () => void;
};

export const DisconnectModal: FC<ModalProps> = ({ isOpen, close }) => {
    const { disconnect } = useDisconnect();

    const handleDisconnect = () => {
        disconnect();
        close();
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={close}
            classNames={{
                base: "bg-footer",
            }}
            backdrop="blur"
            placement="center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 pt-10 text-4xl uppercase text-yellow1">
                            Disconnect Wallet
                        </ModalHeader>
                        <ModalBody>
                            <div className="py-5">
                                <div
                                    className="cursor-pointer bg-brightBlack py-5 text-center"
                                    onClick={() => handleDisconnect()}
                                >
                                    Disconnect wallet
                                </div>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
