import { ERC20ItemType, useGetTokenLists } from "@/hooks/api/tokens";
import { useTimeInMotion } from "@/hooks/misc";
import { PoolType, useHelpers, useProtocolCore } from "@/hooks/onchain/core";
import { toSF, treatWETHAsETHIfApplicable } from "@/utils/format";
import { faInfo, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";
import { formatEther } from "viem";
import { useChainId } from "wagmi";
import { Button } from "../../../components/ui/button";
import { Popover } from "../../../components/ui/Popover";
import {
  FAQ_EMISSION_RATE,
  FAQ_FEES,
  FAQ_TVL,
  FAQ_VOLUME,
  PoolTypes,
} from "../../../config/constants";

type PoolsProps = {
  data: PoolType[];
};

type PoolProps = {
  data: PoolType;
  tokenlist: ERC20ItemType[];
  stableFee: bigint | undefined;
  volatileFee: bigint | undefined;
};

const Pool: FC<PoolProps> = ({ data, tokenlist, stableFee, volatileFee }) => {
  const chainId = useChainId();
  const { push } = useRouter();
  const timeInMotion = useTimeInMotion();
  const timeCompact = useMemo(
    () => Math.floor(timeInMotion / 1000),
    [timeInMotion],
  );
  const dayAgo = useMemo(() => timeCompact - 60 * 60 * 24, [timeCompact]);
  const token0 = useMemo(
    () =>
      tokenlist.find(
        (token) => token.address.toLowerCase() === data.token0.toLowerCase(),
      ),
    [data.token0, tokenlist],
  );
  const token1 = useMemo(
    () =>
      tokenlist.find(
        (token) => token.address.toLowerCase() === data.token1.toLowerCase(),
      ),
    [data.token1, tokenlist],
  );

  const {
    useGetTVLForPool,
    useGetFeesForPool,
    useGetVolumeLockedPerTimeForPool,
  } = useHelpers();
  const { data: quotes } = useGetTVLForPool(data.pool_address);
  const {
    data: [, , , , volume24Hr],
  } = useGetVolumeLockedPerTimeForPool(
    data.pool_address,
    BigInt(dayAgo),
    BigInt(timeCompact),
    60000,
  );
  const { data: fees } = useGetFeesForPool(data.pool_address, 60000);

  return (
    <div className="flex flex-col justify-between gap-3 border-t border-swapBox pt-5 lg:flex-row lg:items-center lg:gap-0">
      <div className="flex lg:w-[25%]">
        <div className="flex items-center">
          <Image
            src={token0?.logoURI || ""}
            alt="icon"
            width={30}
            height={30}
            className="rounded-full"
          />
          <Image
            src={token1?.logoURI || ""}
            alt="icon"
            width={30}
            height={30}
            className="-translate-x-3 rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm">{data.symbol}</span>
          <span className="bg-darkgray p-1 text-xs text-lightblue">
            Basic {data.stable ? "Stable" : "Volatile"} •{" "}
            {Number((data.stable ? stableFee : volatileFee) ?? 0) / 100}%
          </span>
        </div>
      </div>

      <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
        <span className="text-textgray lg:hidden">
          TVL <Popover content="Total volume locked." />
        </span>
        <span>${toSF(formatEther(quotes[2]))}</span>
      </div>
      <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
        <span className="text-textgray lg:hidden">
          {"Fees"} <Popover content="Accrued fees." />
        </span>
        ${toSF(formatEther(fees))}
      </div>
      <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
        <span className="text-textgray lg:hidden">
          {"Volume <24H>"} <Popover content="24-hour volume." />
        </span>
        ${toSF(formatEther(volume24Hr))}
      </div>
      <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
        <span className="text-textgray lg:hidden">
          {"APR"} <Popover content="Emissions rate." />
        </span>
        {toSF(formatEther(data.emissions))}%
      </div>
      <div>
        <Button
          onClick={() =>
            push(
              `/liquidity/deposit?token0=${treatWETHAsETHIfApplicable(data.token0, chainId)}&token1=${treatWETHAsETHIfApplicable(data.token1, chainId)}`,
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
};

export const Pools: FC<PoolsProps> = ({ data }) => {
  const chainId = useChainId();
  const { data: tokenlist = [] } = useGetTokenLists({ variables: { chainId } });
  const { useStableFee, useVolatileFee } = useProtocolCore();
  const { data: stableFee } = useStableFee();
  const { data: volatileFee } = useVolatileFee();

  return (
    <>
      <div className="items-center justify-between lg:flex">
        <div className="lg:w-[25%]">
          <Select
            label="Select a pool type"
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
            {PoolTypes.map((item) => {
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
          {FAQ_TVL.title}
          <Popover content={`${FAQ_TVL.description}`}></Popover>
        </div>
        <div className="hidden w-[130px] text-right lg:block">
          {FAQ_FEES.title}
          <Popover content={`${FAQ_FEES.description}`}></Popover>
        </div>
        <div className="hidden w-[130px] text-right lg:block">
          {FAQ_VOLUME.title}
          <Popover content={`${FAQ_VOLUME.description}`}></Popover>
        </div>
        <div className="hidden w-[130px] text-right lg:block">
          {FAQ_EMISSION_RATE.title}
          <Popover content={`${FAQ_EMISSION_RATE.description}`}></Popover>
        </div>

        <div className="hidden text-right lg:block">{"Action"}</div>
      </div>

      {data.length ? (
        data.map((item, index) => {
          return (
            <Pool
              stableFee={stableFee}
              volatileFee={volatileFee}
              data={item}
              tokenlist={tokenlist}
              key={index}
            />
          );
        })
      ) : (
        <div className="flex w-full gap-3 bg-footer px-5 py-3 text-textgray md:items-center">
          <span className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-textgray">
            <FontAwesomeIcon icon={faInfo} size="xs" />
          </span>
          All LPs will appear here.
        </div>
      )}
    </>
  );
};
