"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import { TransactionInfoModal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useLocks } from "@/hooks/graphql/escrow";
import { useEscrowCore } from "@/hooks/onchain/escrow";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { FC, useMemo, useState } from "react";
import { formatUnits } from "viem";
import { useWatchBlocks } from "wagmi";

type PageProps = {
  params: {
    tokenId: string;
  };
};

const Page: FC<PageProps> = ({ params }) => {
  const [showTXInfoModal, setShowTXInfoModal] = useState(false);
  const useLocksQuery = useLocks();
  const { data: locks = [], refetch: refetchLocks } = useLocksQuery();
  const [selectedLock, setSelectedLock] = useState<number | null>(null);

  const { useEscrowExecutions, useEscrowReadables } = useEscrowCore();

  const {
    merge,
    isError: mergeError,
    isPending: mergePending,
    isSuccess: mergeSuccess,
    hash: mergeHash,
    reset: resetMerge,
  } = useEscrowExecutions(() => setShowTXInfoModal(true));
  const { useLocked, useBalanceOfNFT } = useEscrowReadables();
  const {
    data: locked = {
      amount: BigInt(0),
      end: BigInt(0),
      isPermanent: false,
    },
    refetch: refetchLocked,
  } = useLocked(Number(params.tokenId));
  const { data: weight = BigInt(0), refetch: refetchNFTBalance } =
    useBalanceOfNFT(Number(params.tokenId));

  const yearsLocked = useMemo(
    () => (Number(locked.end) - Math.floor(Date.now() / 1000)) / 31536000,
    [locked.end],
  );

  useWatchBlocks({
    onBlock: async () => {
      await Promise.all([refetchLocks(), refetchLocked(), refetchNFTBalance()]);
    },
  });

  return (
    <div className="p-5 pb-20">
      <Image
        src={BEAR1}
        alt="bear"
        className="absolute left-[50%] top-0 translate-x-[-50%]"
        width={350}
      />

      <div className="z-1 relative m-auto mt-32 flex max-w-[620px] flex-col gap-10">
        <div className="bg-footer p-5 md:p-8">
          <div className="flex flex-col gap-7 text-sm sm:text-base">
            <div className="flex flex-col gap-5">
              <div className="space-y-1">
                <p>Select the lock you want to merge</p>
              </div>
            </div>

            <Select
              label="Select the lock"
              classNames={{
                trigger:
                  "bg-transparent data-[hover=true]:bg-transparent border border-swapBox",
                listbox: "bg-footer",
                listboxWrapper: "bg-footer",
                popoverContent:
                  "p-0 bg-footer border rounded-none border-swapBox",
                label: "hidden",
                base: "!m-0",
                value: "!text-white",
              }}
              radius="none"
              labelPlacement="outside"
            >
              {locks
                .filter((lock) => lock.tokenId !== params.tokenId)
                .map((item, index) => {
                  return (
                    <SelectItem
                      onPress={() => setSelectedLock(Number(item.tokenId))}
                      key={index}
                      className="data-[hover=true]:border data-[hover=true]:border-swapBox data-[hover=true]:bg-transparent data-[hover=true]:text-white"
                    >
                      Lock {item.tokenId}
                    </SelectItem>
                  );
                })}
            </Select>

            <div className="flex items-center gap-2 text-navDefault">
              <div className="flex h-[15px] w-[15px] items-center justify-center rounded-full border border-navDefault">
                <FontAwesomeIcon icon={faInfo} className="w-[3px]" />
              </div>
              <div>Merging an Auto Max-Lock is not allowed.</div>
            </div>

            <Divider className="bg-swapBox" />

            <p className="text-lg">Merging into lock #{selectedLock}</p>
            <p className="text-navDefault">
              <span className="text-white">
                {Number(formatUnits(locked.amount, 18)).toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: 4,
                    useGrouping: true,
                  },
                )}
              </span>{" "}
              MONI locked for {yearsLocked.toFixed(5)} years
            </p>
            <p className="text-navDefault">
              <span className="text-white">
                {Number(formatUnits(weight, 18)).toLocaleString("en-US", {
                  maximumFractionDigits: 4,
                  useGrouping: true,
                })}
              </span>{" "}
              veMONI voting power granted
            </p>
          </div>
        </div>

        <Button
          onClick={() => merge(Number(params.tokenId), Number(selectedLock))}
          disabled={mergePending || selectedLock === null}
          isLoading={mergePending}
          variant="primary"
          className="w-full"
        >
          Merge
        </Button>
      </div>

      <TransactionInfoModal
        isOpen={showTXInfoModal}
        close={() => {
          setShowTXInfoModal(false);
          resetMerge();
          setSelectedLock(null);
        }}
        type={mergeSuccess ? "success" : mergeError ? "failure" : "failure"}
        txHash={mergeHash}
      />
    </div>
  );
};

export default Page;
