import { RootState } from "@/store";
import {
    changeExecutionDeadlineInMinutes,
    changeSlippageTolerance,
} from "@/store/slices/walletSettings";
import {
    cn,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@nextui-org/react";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

type ModalProps = {
    isOpen: boolean;
    close: () => void;
};

export const SettingsModal: FC<ModalProps> = ({ isOpen, close }) => {
    const dispatch = useDispatch();

    const { slippageTolerance, executionDeadlineInMinutes } = useSelector(
        (state: RootState) => state.wallet,
    );
    const slippageToleranceOptions = [0.5, 1, 5];
    const executionDeadlineOptions = [1, 5, 10, 30];

    const confirmChange = () => {
        // TODO: init store and save changes
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
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 pt-10 text-4xl uppercase text-yellow1">
                            settings
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-10 pb-5">
                                <div className="space-y-7">
                                    <div>Slippage Tolerance</div>

                                    <div className="grid grid-cols-4 text-textgray">
                                        {slippageToleranceOptions.map(
                                            (value, index) => (
                                                <button
                                                    key={index}
                                                    className={cn(
                                                        "flex cursor-pointer items-center justify-center bg-brightBlack py-7 hover:border hover:border-btn-primary/40",
                                                        {
                                                            "border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white":
                                                                slippageTolerance ===
                                                                value,
                                                        },
                                                    )}
                                                    onClick={() =>
                                                        dispatch(
                                                            changeSlippageTolerance(
                                                                value,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {value}%
                                                </button>
                                            ),
                                        )}
                                        <div
                                            className={cn(
                                                "flex cursor-pointer items-center justify-center bg-brightBlack py-7",
                                                {
                                                    "border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white":
                                                        !slippageToleranceOptions.includes(
                                                            slippageTolerance,
                                                        ),
                                                },
                                            )}
                                        >
                                            <Input
                                                classNames={{
                                                    base: "bg-transparent",
                                                    inputWrapper:
                                                        "bg-transparent group-data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent",
                                                    input: "text-center !text-white",
                                                }}
                                                onValueChange={(val) =>
                                                    dispatch(
                                                        changeSlippageTolerance(
                                                            Number(val),
                                                        ),
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className=""></p>

                                <div className="space-y-7">
                                    <div>Transaction Deadline</div>

                                    <div className="grid grid-cols-4 text-textgray">
                                        {executionDeadlineOptions.map(
                                            (value, index) => (
                                                <div
                                                    key={index}
                                                    className={cn(
                                                        "flex cursor-pointer justify-center bg-brightBlack py-7 hover:border hover:border-btn-primary/40",
                                                        {
                                                            "border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white":
                                                                value ===
                                                                executionDeadlineInMinutes,
                                                        },
                                                    )}
                                                    onClick={() =>
                                                        dispatch(
                                                            changeExecutionDeadlineInMinutes(
                                                                value,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {value} MIN
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div
                                        className="flex cursor-pointer justify-center bg-brightBlack py-10 uppercase text-textgray"
                                        onClick={close}
                                    >
                                        Cancel
                                    </div>
                                    <div
                                        className="flex cursor-pointer justify-center bg-btn-primary py-10 uppercase"
                                        onClick={confirmChange}
                                    >
                                        Confirm
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
