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
import { FC, MouseEventHandler, useMemo, useState } from "react";

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
                    alt={item.symbol}
                    width={30}
                    height={30}
                    className="rounded-full"
                />
                <span className="text-xl">{item.name}</span>
            </div>

            {isLoading ? (
                <Spinner size="sm" />
            ) : (
                <div className="flex flex-col items-end">
                    <span className="text-xl">{balance.toFixed(4)}</span>
                    <span className="text-textlightgray">$0</span>
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
    const [searchValue, setSearchValue] = useState("");
    const filteredList = useMemo(
        () =>
            tokenLists.filter(
                (token) =>
                    token.name
                        .toLowerCase()
                        .startsWith(searchValue.toLowerCase()) ||
                    token.address
                        .toLowerCase()
                        .startsWith(searchValue.toLowerCase()) ||
                    token.symbol
                        .toLowerCase()
                        .startsWith(searchValue.toLowerCase()),
            ),
        [tokenLists, searchValue],
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
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 pt-10 text-3xl text-yellow1">
                            Select a Token
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-5">
                                <Input
                                    placeholder="Search by name, symbol or address"
                                    onChange={(ev) =>
                                        setSearchValue(ev.target.value)
                                    }
                                />

                                <div className="grid grid-cols-4 gap-3">
                                    {tokenLists
                                        .sort(() => Math.random() - 0.5)
                                        .slice(0, 5)
                                        .map((token) => (
                                            <div
                                                key={token.address}
                                                className="flex items-center gap-2 bg-brightBlack px-2 py-3"
                                                onClick={() => {
                                                    onItemClick(token);
                                                    close();
                                                }}
                                            >
                                                <Image
                                                    src={token.logoURI}
                                                    alt={token.symbol}
                                                    height={20}
                                                    width={20}
                                                    className="rounded-full"
                                                />
                                                <span className="text-lg">
                                                    {token.symbol}
                                                </span>
                                            </div>
                                        ))}
                                </div>

                                <Divider className="bg-swapBox" />

                                <div className="max-h-[300px] w-full overflow-y-auto">
                                    {filteredList.map((item, index) => {
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
