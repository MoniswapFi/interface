import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { FC, useCallback } from "react";
import { useDisconnect } from "wagmi";

type ModalProps = {
    isOpen: boolean;
    close: () => void;
};

export const DisconnectModal: FC<ModalProps> = ({ isOpen, close }) => {
    const { disconnect } = useDisconnect();

    const handleDisconnect = useCallback(() => {
        disconnect();
        close();
    }, [close, disconnect]);

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
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 pt-10 text-4xl uppercase text-yellow1">
                            Disconnect Wallet
                        </ModalHeader>
                        <ModalBody>
                            <div className="w-full py-5">
                                <button
                                    className="w-full cursor-pointer bg-brightBlack px-2 py-5 text-center"
                                    onClick={() => handleDisconnect()}
                                >
                                    Disconnect wallet
                                </button>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
