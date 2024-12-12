"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import MoniIcon from "@/assets/images/logo.svg";
import { TransactionInfoModal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { useEscrowCore } from "@/hooks/onchain/escrow";
import { Divider, Input } from "@nextui-org/react";
import Image from "next/image";
import { FC, useMemo, useState } from "react";
import { formatUnits, isAddress } from "viem";
import { useWatchBlocks } from "wagmi";

type PageProps = {
  params: {
    tokenId: string;
  };
};

const Page: FC<PageProps> = ({ params }) => {
  const [showTXInfoModal, setShowTXInfoModal] = useState(false);
  const [recipient, setRecipient] = useState("");

  const { useEscrowExecutions, useEscrowReadables } = useEscrowCore();

  const {
    transferNFT,
    isError: transferError,
    isPending: transferPending,
    isSuccess: transferSuccess,
    hash: transferHash,
    reset: resetTransfer,
  } = useEscrowExecutions(() => setShowTXInfoModal(true));
  const { useLocked } = useEscrowReadables();
  const {
    data: locked = {
      amount: BigInt(0),
      end: BigInt(0),
      isPermanent: false,
    },
    refetch: refetchLocked,
  } = useLocked(Number(params.tokenId));

  const yearsLocked = useMemo(
    () => (Number(locked.end) - Math.floor(Date.now() / 1000)) / 31536000,
    [locked.end],
  );

  useWatchBlocks({
    onBlock: async () => {
      await refetchLocked();
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
                <p>Lock transfer</p>
              </div>
            </div>

            <Divider className="bg-swapBox" />

            <div className="item flex items-center gap-3">
              <div className="bg-black p-2">
                <Image src={MoniIcon} alt="icon" className="w-[50px]" />
              </div>
              <div className="space-y-2">
                <p>Lock ID {params.tokenId}</p>
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
              </div>
            </div>

            <Divider className="bg-swapBox" />

            <p>To wallet address</p>

            <div>
              <Input
                onChange={(ev) => setRecipient(ev.target.value)}
                radius="none"
                placeholder="0x"
                classNames={{
                  base: "bg-btn-black border-swapBox border",
                  inputWrapper:
                    "bg-transparent group-data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent",
                  input: "!text-white",
                }}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={() => transferNFT(recipient, Number(params.tokenId))}
          isLoading={transferPending}
          disabled={transferPending || !isAddress(recipient)}
          variant="primary"
          className="w-full"
        >
          Transfer
        </Button>
      </div>

      <TransactionInfoModal
        isOpen={showTXInfoModal}
        close={() => {
          setShowTXInfoModal(false);
          resetTransfer();
        }}
        type={
          transferSuccess ? "success" : transferError ? "failure" : "failure"
        }
        txHash={transferHash}
      />
    </div>
  );
};

export default Page;
