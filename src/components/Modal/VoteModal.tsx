"use client";

import type { Lock, Pair } from "@/graphclient";
import { useGetLockMetadata } from "@/hooks/api/tokens";
import { useAllPools } from "@/hooks/graphql/core";
import { useTimeInMotion } from "@/hooks/misc";
import { useProtocolCore } from "@/hooks/onchain/core";
import { useEscrowCore } from "@/hooks/onchain/escrow";
import { useVoterCore } from "@/hooks/onchain/voting";
import { RootState } from "@/store";
import {
  changePoolWeight,
  deselectPoolFromVoting,
} from "@/store/slices/voting";
import { TokenType } from "@/types";
import { toSF } from "@/utils/format";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import Image from "next/image";
import { FC, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatUnits, zeroAddress } from "viem";
import { useWatchBlocks } from "wagmi";
import { Popover } from "../ui/Popover";

type ModalProps = {
  isOpen: boolean;
  close: () => void;
  lock: Lock;
  tokenlist: TokenType[];
};

type ListItemProps = {
  id: string;
  pairList: Pair[];
  availableVotingWeight: bigint;
  totalVoteWeight: bigint;
  tokenlist: TokenType[];
};

const SelectedPoolsItem: FC<ListItemProps> = ({
  id,
  pairList,
  availableVotingWeight,
  tokenlist,
  totalVoteWeight,
}) => {
  const pair = useMemo(
    () => pairList.find((p) => p.id.toLowerCase() === id.toLowerCase()),
    [id, pairList],
  )!;
  const { useStableFee, useVolatileFee } = useProtocolCore();
  const { data: stableFee = BigInt(0) } = useStableFee();
  const { data: volatileFee = BigInt(0) } = useVolatileFee();
  const { useGetPoolWeight, useGetPoolGauge, useGaugeClaimable } =
    useVoterCore();
  const { data: poolWeight = BigInt(0), refetch: refetchPoolWeight } =
    useGetPoolWeight(pair.id);
  const { data: gaugeId = zeroAddress, refetch: refetchGaugeId } =
    useGetPoolGauge(pair.id);
  const { data: gaugeClaimable = BigInt(0), refetch: refetchGaugeClaimable } =
    useGaugeClaimable(gaugeId);
  const token0 = useMemo(
    () =>
      tokenlist.find(
        (token) => token.address.toLowerCase() === pair.token0.id.toLowerCase(),
      ),
    [tokenlist, pair.token0],
  );
  const token1 = useMemo(
    () =>
      tokenlist.find(
        (token) => token.address.toLowerCase() === pair.token1.id.toLowerCase(),
      ),
    [tokenlist, pair.token1],
  );

  const allowedPercentages = useMemo(() => [0, 10, 25, 50, 75, 100], []);
  const dispatch = useDispatch();
  const { weight } = useSelector((state: RootState) => state.voting);

  useWatchBlocks({
    onBlock: async () => {
      await refetchPoolWeight();
      await refetchGaugeId();
      await refetchGaugeClaimable();
    },
  });

  return (
    <div className="flex w-full gap-5">
      <div className="w-[40%]">
        <div className="relative flex w-full items-center gap-1">
          <div className="flex items-center">
            <Image
              src={token0?.logoURI ?? ""}
              alt="icon"
              width={20}
              height={20}
              className="rounded-full"
            />
            <Image
              src={token1?.logoURI ?? ""}
              alt="icon"
              width={20}
              height={20}
              className="-translate-x-1 rounded-full"
            />
          </div>

          <div className="">
            <p className="text-sm">
              {pair.stable ? "sAMM" : "vAMM"}-{pair.token0.symbol}/
              {pair.token1.symbol}
            </p>
            <div className="text-xs">
              <span className="text-lightblue">
                {pair.stable ? "Stable" : "Volatile"} Pool ·{" "}
                {toSF(Number(pair.stable ? stableFee : volatileFee) / 100)}%{" "}
              </span>
              <Popover content="Pool fee." />
            </div>
          </div>

          <button
            onClick={() => dispatch(deselectPoolFromVoting(pair.id))}
            className="absolute right-[-5px] top-[-10px] flex h-[14px] w-[14px] items-center justify-center rounded-full bg-white p-2"
          >
            <FontAwesomeIcon icon={faXmark} className="text-xs text-black" />
          </button>
        </div>

        <div className="mt-4 space-y-2 text-xs lg:text-sm">
          <div className="space-x-1">
            <span className="text-brightGray">Vote Weight</span>
            <span className="text-gray1">
              {toSF(formatUnits(poolWeight, 18))}
            </span>
          </div>

          <div className="space-x-1">
            <span className="text-brightGray">Total Rewards</span>
            <span className="text-gray1">
              {toSF(formatUnits(gaugeClaimable, 18))} MONI
            </span>
          </div>
          <div className="space-x-1">
            <span className="text-brightGray">Voting</span>
            <span className="text-gray1">APR 127.31%</span>
          </div>

          <div className="!mt-5 space-y-2">
            <div className="text-brightGray">Est. Rewards</div>
            <div className="text-gray1">3~$0.0</div>
          </div>
        </div>
      </div>

      <div className="w-[60%] space-y-3">
        <div className="grid grid-cols-2 text-sm">
          <div className="flex flex-col justify-center gap-1 px-3 text-right">
            <p className="text-brightGray">Voting Power</p>
            <p className="text-gray1">
              {toSF(formatUnits(BigInt(weight[pair.id] ?? 0), 18))} veMONI
            </p>
          </div>

          <div className="flex items-center justify-center bg-nightRider py-3">
            % {toSF(((weight[pair.id] || 0) / Number(totalVoteWeight)) * 100)}
          </div>
        </div>

        <div className="flex justify-end gap-1 text-xs text-gray1">
          {allowedPercentages.map((percentage, index) => (
            <button
              disabled={
                (weight[pair.id] || 0) / Number(totalVoteWeight) ===
                  percentage / 100 ||
                (percentage / 100) * Number(totalVoteWeight) >
                  Number(availableVotingWeight)
              }
              onClick={() =>
                dispatch(
                  changePoolWeight([
                    pair.id,
                    (percentage / 100) * Number(totalVoteWeight),
                  ]),
                )
              }
              key={index}
              className="w-fit bg-darkgray px-2 py-1 text-xs"
            >
              {percentage}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const VoteModal: FC<ModalProps> = ({
  isOpen,
  close,
  lock,
  tokenlist,
}) => {
  const { data: metadata } = useGetLockMetadata({
    variables: { uri: lock.tokenURI },
  });
  const timeInMotion = useTimeInMotion();
  const { useEscrowReadables } = useEscrowCore();
  const { useBalanceOfNFT } = useEscrowReadables();

  const { data: weight = BigInt(0), refetch: refetchNFTBalance } =
    useBalanceOfNFT(Number(lock.tokenId));

  const { weights } = useSelector((state: RootState) => state.voting);

  const availableVP = useMemo(
    () => Number(weight) - weights.reduce((prev, curr) => prev + curr, 0),
    [weight, weights],
  );

  const { selectedPools } = useSelector((state: RootState) => state.voting);
  const usePoolsQuery = useAllPools();
  const { data: pairList = [], refetch: refetchPairs } = usePoolsQuery();

  useWatchBlocks({
    onBlock: async () => {
      await refetchNFTBalance();
      await refetchPairs();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={close}
      backdrop="blur"
      classNames={{
        base: "bg-footer",
      }}
      hideCloseButton
      placement="center"
    >
      <ModalContent className="lg:min-w-[700px]">
        {() => (
          <>
            <ModalHeader></ModalHeader>
            <ModalBody className="max-h-[700px] w-full space-y-2 px-2 pb-5">
              <div>
                <div className="relative flex items-center justify-between bg-nightRider p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-fit bg-neroBlack p-3">
                      <Image
                        alt="icon"
                        src={metadata?.image_data || ""}
                        className="w-[20px]"
                        width={40}
                        height={40}
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-lg">Lock ID {lock.tokenId}</p>
                      <p className="text-sm text-gray1">
                        {toSF(lock.amountLocked)} MONI locked for{" "}
                        {toSF(
                          (Number(lock.lockTime) -
                            Math.floor(timeInMotion / 1000)) /
                            31536000,
                        )}{" "}
                        years
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-right text-lg">
                    <p>Total Voting Power</p>
                    <p className="text-green2">
                      {toSF((availableVP / Number(weight)) * 100)}% Available
                    </p>
                  </div>

                  <button
                    onClick={close}
                    className="absolute right-[-5px] top-[-10px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white p-2"
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="text-xs text-black"
                    />
                  </button>
                </div>
              </div>

              <div className="flex w-full flex-col items-center justify-start overflow-y-auto px-1 py-4 lg:px-4">
                {selectedPools.map((id) => (
                  <SelectedPoolsItem
                    key={id}
                    id={id}
                    tokenlist={tokenlist}
                    pairList={pairList}
                    availableVotingWeight={BigInt(availableVP)}
                    totalVoteWeight={weight}
                  />
                ))}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
