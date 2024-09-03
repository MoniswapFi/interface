import { type Pair } from "@/graphclient";
import { useGetTokenLists } from "@/hooks/api/tokens";
import { useProtocolCore } from "@/hooks/onchain/core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "../../../components/ui/button";
import { Popover } from "../../../components/ui/Popover";
import { PoolTypes } from "../../../config/constants";

type PoolsProps = {
    data: Pair[];
};

export const Pools: FC<PoolsProps> = ({ data }) => {
    const { data: tokenlist = [] } = useGetTokenLists({});
    const { useStableFee, useVolatileFee } = useProtocolCore();
    const { data: stableFee } = useStableFee();
    const { data: volatileFee } = useVolatileFee();

    const { push } = useRouter();

    return (
        <>
            <div className="items-center justify-between lg:flex">
                <div className="lg:w-[25%]">
                    <Select
                        label="Select an animal"
                        classNames={{
                            trigger:
                                "bg-transparent data-[hover=true]:bg-transparent border border-btn-primary",
                            listbox: "bg-footer",
                            listboxWrapper: "bg-footer",
                            popoverContent:
                                "p-0 bg-footer border rounded-none border-btn-primary",
                            label: "hidden",
                            base: "!m-0",
                            value: "!text-white",
                        }}
                        radius="none"
                        defaultSelectedKeys={"all"}
                        labelPlacement="outside"
                    >
                        {PoolTypes.map((item, index) => {
                            return (
                                <SelectItem
                                    key={item.key}
                                    className="data-[hover=true]:border data-[hover=true]:border-btn-primary data-[hover=true]:bg-transparent data-[hover=true]:text-white"
                                >
                                    {item.text}
                                </SelectItem>
                            );
                        })}
                    </Select>
                </div>
                <div className="hidden w-[130px] text-right lg:block">
                    TVL <Popover content="Popover con." />
                </div>
                <div className="hidden w-[130px] text-right lg:block">
                    {"Fees <24H>"} <Popover content="Popover content here." />
                </div>
                <div className="hidden w-[130px] text-right lg:block">
                    {"Volumn <24H>"} <Popover content="Popover content here." />
                </div>
                <div className="hidden w-[130px] text-right lg:block">
                    {"APR <24H>"} <Popover content="Popover content here." />
                </div>
                <div className="hidden text-right lg:block">{"Action"}</div>
            </div>

            {data.map((item, index) => {
                return (
                    <div
                        className="flex flex-col justify-between gap-3 border-t border-swapBox pt-5 lg:flex-row lg:items-center lg:gap-0"
                        key={index}
                    >
                        <div className="flex lg:w-[25%]">
                            <div className="flex items-center">
                                <Image
                                    src={
                                        tokenlist.find(
                                            (tt) =>
                                                tt.address.toLowerCase() ===
                                                item.token0.id.toLowerCase(),
                                        )?.logoURI ?? ""
                                    }
                                    alt="icon"
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                />
                                <Image
                                    src={
                                        tokenlist.find(
                                            (tt) =>
                                                tt.address.toLowerCase() ===
                                                item.token1.id.toLowerCase(),
                                        )?.logoURI ?? ""
                                    }
                                    alt="icon"
                                    width={30}
                                    height={30}
                                    className="-translate-x-3 rounded-full"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm">
                                    {item.stable ? "sAMM" : "vAMM"}-
                                    {item.token0.symbol}/{item.token1.symbol}
                                </span>
                                <span className="bg-darkgray p-1 text-xs text-lightblue">
                                    Basic {item.stable ? "Stable" : "Volatile"}{" "}
                                    •{" "}
                                    {Number(
                                        (item.stable
                                            ? stableFee
                                            : volatileFee) ?? 0,
                                    ) / 100}
                                    %
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
                            <span className="text-textgray lg:hidden">
                                TVL <Popover content="Popover content here." />
                            </span>
                            <span>
                                $
                                {Number(item.reserveUSD).toLocaleString(
                                    "en-US",
                                    {
                                        useGrouping: true,
                                        maximumFractionDigits: 3,
                                    },
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
                            <span className="text-textgray lg:hidden">
                                {"Fees <24H>"}{" "}
                                <Popover content="Popover content here." />
                            </span>
                            $
                            {Number(item.feesUSD).toLocaleString("en-US", {
                                useGrouping: true,
                                maximumFractionDigits: 3,
                            })}
                        </div>
                        <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
                            <span className="text-textgray lg:hidden">
                                {"Volumn <24H>"}{" "}
                                <Popover content="Popover content here." />
                            </span>
                            $
                            {Number(item.volumeUSD).toLocaleString("en-US", {
                                useGrouping: true,
                                maximumFractionDigits: 3,
                            })}
                        </div>
                        <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
                            <span className="text-textgray lg:hidden">
                                {"APR <24H>"}{" "}
                                <Popover content="Popover content here." />
                            </span>
                            0.00%
                        </div>
                        <div>
                            <Button
                                onClick={() =>
                                    push(
                                        `/liquidity/deposit?token0=${item.token0.id}&token1=${item.token1.id}`,
                                    )
                                }
                                className="w-full text-btn-primary lg:min-w-0"
                            >
                                <FontAwesomeIcon icon={faPlus} />{" "}
                                <span className="lg:hidden">Add Liquidity</span>
                            </Button>
                        </div>
                    </div>
                );
            })}
        </>
    );
};
