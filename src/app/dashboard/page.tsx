"use client";

import Image2 from "@/assets/images/image2.svg";
import Rectangle from "@/assets/images/Rectangle_t.svg";
import { usePoolPositions } from "@/hooks/graphql/core";
import { useVotePositions } from "@/hooks/graphql/voting";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useWatchBlocks } from "wagmi";
import { LiquidityReward } from "./_components/LiquidityReward";
import { VotingReward } from "./_components/VotingReward";

export default function Page() {
  const usePositionsQuery = usePoolPositions();
  const useVotePositionQuery = useVotePositions();
  const { data: positions = [], refetch: refetchAccountPositions } =
    usePositionsQuery();
  const { data: votes = [], refetch: refetchVotePositions } =
    useVotePositionQuery();

  useWatchBlocks({
    onBlock: async () => {
      await refetchAccountPositions();
      await refetchVotePositions();
    },
  });

  return (
    <div className="relative space-y-10 overflow-hidden p-5 md:p-20">
      <Image
        src={Rectangle}
        alt="image"
        className="absolute -right-[100px] -top-[100px] w-[250px] lg:w-[200px]"
      />
      <Image
        src={Image2}
        alt="image"
        className="right-[100px] top-[0] !mt-0 w-[200px] lg:absolute lg:w-[350px]"
      />

      <div className="relative space-y-5 lg:pb-28 lg:pt-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl md:text-[50px]">
              Manage Your{" "}
              <span className="text-gradient from-btn-primary to-gold">
                Liquidity
              </span>
            </h2>

            <h2 className="text-3xl md:text-[50px]">
              And Voting{" "}
              <span className="text-gradient from-btn-primary to-gold">
                Rewards
              </span>
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-2xl">Liquidity Rewards</p>
        {positions.length ? (
          <div className="flex flex-col gap-3">
            {positions.map((position) => (
              <LiquidityReward data={position} key={position.id} />
            ))}
          </div>
        ) : (
          <div className="flex w-full gap-3 bg-footer px-5 py-3 text-textgray md:items-center">
            <span className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-textgray">
              <FontAwesomeIcon icon={faInfo} size="xs" />
            </span>
            Your LP rewards will appear here.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <p className="text-lg md:text-2xl">Voting Rewards</p>
        {votes.length ? (
          <div className="flex flex-col gap-3">
            {votes.map((vote) => (
              <VotingReward data={vote} key={vote.id} />
            ))}
          </div>
        ) : (
          <div className="flex w-full gap-3 bg-footer px-5 py-3 text-textgray md:items-center">
            <span className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-textgray">
              <FontAwesomeIcon icon={faInfo} size="xs" />
            </span>
            Your voting rewards will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
