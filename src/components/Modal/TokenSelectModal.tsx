import BeraLogo from "@/assets/images/Bera.png";
import { __ETHER__ } from "@/config/constants";
import { useERC20Balance, useNativeBalance } from "@/hooks/onchain/wallet";
import { TokenType } from "@/types";
import {
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Spinner,
} from "@nextui-org/react";
import clsx from "clsx";
import Image from "next/image";
import { FC, MouseEventHandler, useMemo } from "react";

type ModalProps = {
    isOpen: boolean;
    close: () => void;
    tokenLists: TokenType[];
    onItemClick: (token: TokenType) => any;
    selectedTokens: [TokenType, TokenType];
};

type TokenSelectableItemProps = {
    onSelect: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    item: TokenType;
};

const TokenSelectableItem: FC<TokenSelectableItemProps> = ({
    onSelect,
    disabled,
    item,
}) => {
    const { isLoading: erc20BalanceLoading, balance: erc20Balance } =
        useERC20Balance(item.address as any);
    const { isLoading: nativeBalanceLoading, balance: nativeBalance } =
        useNativeBalance();
    const isLoading = useMemo(
        () => erc20BalanceLoading || nativeBalanceLoading,
        [erc20BalanceLoading, nativeBalanceLoading],
    );
    const balance = useMemo(
        () => (item.address === __ETHER__ ? nativeBalance : erc20Balance),
        [item.address, nativeBalance, erc20Balance],
    );

    return (
        <button
            onClick={onSelect}
            disabled={disabled}
            className={clsx(
                "flex w-full cursor-pointer items-center justify-between border-none px-2 py-2 hover:bg-brightBlack",
                {
                    "bg-brightBlack": disabled,
                },
            )}
        >
            <div className="flex items-center gap-2">
                <Image
                    src={item.logoURI}
                    alt="token logo"
                    width={30}
                    height={30}
                />
                <span className="text-xl">{item.name}</span>
            </div>

            {isLoading ? (
                <Spinner size="sm" />
            ) : (
                <div className="flex flex-col items-end">
                    <span className="text-xl">{balance.toFixed(4)}</span>
                    <span className="text-textlightgray">$254.89</span>
                </div>
            )}
        </button>
    );
};

export const TokenSelectModal: FC<ModalProps> = ({
    isOpen,
    close,
    tokenLists,
    onItemClick,
    selectedTokens,
}) => {
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
                        <ModalHeader className="flex flex-col gap-1 pt-10 text-3xl text-yellow1">
                            Select a Token
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-5">
                                <Input placeholder="Search by name, symbol or address" />

                                <div className="grid grid-cols-4 gap-3">
                                    <div className="flex items-center gap-2 bg-brightBlack px-2 py-3">
                                        <Image
                                            src={BeraLogo}
                                            alt="token logo"
                                        />
                                        <span className="text-xl">BERA</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-brightBlack px-2 py-3">
                                        <Image
                                            src={BeraLogo}
                                            alt="token logo"
                                        />
                                        <span className="text-xl">BERA</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-brightBlack px-2 py-3">
                                        <Image
                                            src={BeraLogo}
                                            alt="token logo"
                                        />
                                        <span className="text-xl">BERA</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-brightBlack px-2 py-3">
                                        <Image
                                            src={BeraLogo}
                                            alt="token logo"
                                        />
                                        <span className="text-xl">BERA</span>
                                    </div>
                                </div>

                                <Divider className="bg-swapBox" />

                                <div className="max-h-[300px] w-full overflow-y-auto">
                                    {tokenLists.map((item, index) => {
                                        return (
                                            <TokenSelectableItem
                                                key={index}
                                                item={item}
                                                onSelect={() => {
                                                    onItemClick(item);
                                                    close();
                                                }}
                                                disabled={selectedTokens.includes(
                                                    item,
                                                )}
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
