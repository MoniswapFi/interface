"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import { ConnectButton } from "@/components/ConnectButton";
import { TransactionInfoModal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { ChipBadge } from "@/components/ui/chipBadge";
import { useGetTokenLists } from "@/hooks/api/tokens";
import { useSinglePoolInfo } from "@/hooks/graphql/core";
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { useGaugeCore } from "@/hooks/onchain/gauge";
import { useVoterCore } from "@/hooks/onchain/voting";
import { useERC20Allowance, useERC20Balance } from "@/hooks/onchain/wallet";
import { toSF } from "@/utils/format";
import { div } from "@/utils/math";
import { Divider, Slider } from "@nextui-org/react";
import Image from "next/image";
import { FC, useMemo, useState } from "react";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { useAccount, useWatchBlocks } from "wagmi";

type PageProps = {
  params: {
    poolId: string;
  };
};

const Page: FC<PageProps> = ({ params }) => {
  const [percentage, setPercentage] = useState(0.0);
  const [showTXInfoModal, setShowTXInfoModal] = useState(false);

  const { isConnected } = useAccount();

  const { data: tokenlist = [] } = useGetTokenLists();

  const { usePoolFee } = useProtocolCore();
  const { usePoolSymbol, usePoolTotalSupply, usePoolStability } =
    usePoolMetadata(params.poolId as any);
  const { data: stable = false } = usePoolStability();
  const { data: fee } = usePoolFee(params.poolId as any, stable);
  const { data: poolSymbol } = usePoolSymbol();
  const { data: poolTotalSupply, refetch: refetchPoolSupply } =
    usePoolTotalSupply();
  const useIndexedPool = useSinglePoolInfo(params.poolId.toLowerCase());
  const { data: pair, refetch: refetchPair } = useIndexedPool();

  const { balance: position } = useERC20Balance(params.poolId as any);
  const formattedTS = useMemo(
    () => Number(formatUnits(poolTotalSupply ?? BigInt(1), 18)),
    [poolTotalSupply],
  );
  const positionRatio = useMemo(
    () => div(position, formattedTS),
    [formattedTS, position],
  );
  const token0Deposited = useMemo(
    () => positionRatio * Number(pair?.reserve0 ?? "0"),
    [pair?.reserve0, positionRatio],
  );
  const token1Deposited = useMemo(
    () => positionRatio * Number(pair?.reserve1 ?? "0"),
    [pair?.reserve1, positionRatio],
  );

  const token0 = useMemo(
    () =>
      tokenlist.find(
        (token) =>
          token.address.toLowerCase() === pair?.token0.id.toLowerCase(),
      ),
    [tokenlist, pair?.token0.id],
  );
  const token1 = useMemo(
    () =>
      tokenlist.find(
        (token) =>
          token.address.toLowerCase() === pair?.token1.id.toLowerCase(),
      ),
    [tokenlist, pair?.token1.id],
  );

  const { useGetPoolGauge, useVotingExecutions } = useVoterCore();
  const { data: gaugeId = zeroAddress, refetch: refetchGaugeId } =
    useGetPoolGauge(params.poolId);
  const {
    createGauge,
    isPending: createGaugePending,
    isError: createGaugeErrored,
    isSuccess: createGaugeSuccess,
    hash: createGaugeHash,
    reset: resetCreateGauge,
  } = useVotingExecutions(() => setShowTXInfoModal(true));

  const stakable = useMemo(() => percentage * position, [percentage, position]);

  const { useGaugeExecutions, useGaugeReadables } = useGaugeCore();
  const { useRewardRate } = useGaugeReadables(gaugeId);
  const { data: rewardRate = BigInt(0), refetch: refetchRewardRate } =
    useRewardRate();
  const {
    deposit,
    isPending: depositPending,
    isError: depositError,
    isSuccess: depositSuccess,
    hash: depositHash,
    reset: resetDeposit,
  } = useGaugeExecutions(gaugeId, () => setShowTXInfoModal(true));
  const { useAllowance, useApproval } = useERC20Allowance(params.poolId as any);

  const { data: allowance, refetch: refetchAllowance } = useAllowance(gaugeId);

  const allowedToSpend = useMemo(
    () => Number(formatUnits(allowance ?? BigInt(0), 18)),
    [allowance],
  );

  const { executeApproval, isPending: approvalPending } = useApproval(
    gaugeId,
    Number(parseUnits(stakable.toString(), 18)),
  );

  useWatchBlocks({
    onBlock: async () => {
      await refetchGaugeId();
      await refetchPoolSupply();
      await refetchPair();
      await refetchAllowance();
      await refetchRewardRate();
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
        <div className="flex flex-col gap-5 bg-footer p-5 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
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

              <div>
                <span>{poolSymbol}</span>
                <ChipBadge>
                  Basic {stable ? "Stable" : "Volatile"} ·
                  {Number(fee ?? 0) / 100}%
                </ChipBadge>
              </div>
            </div>

            <div className="text-right text-navDefault">
              <p>APR</p>
              <p>{Number(rewardRate)}%</p>
            </div>
          </div>

          <Divider className="bg-swapBox" />

          <div className="flex w-full items-start justify-between gap-3">
            <div className="flex flex-col items-start justify-start gap-2">
              <span className="capitalize text-swapBox">liquidity</span>
              <div className="flex flex-col items-start justify-start gap-1">
                <div>
                  <span className="text-swapBox">
                    {!!pair ? toSF(pair.reserve0) : 0.0}
                  </span>{" "}
                  <span>{pair?.token0.symbol}</span>
                </div>

                <div>
                  <span className="text-swapBox">
                    {!!pair ? toSF(pair.reserve1) : 0.0}
                  </span>{" "}
                  <span>{pair?.token1.symbol}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-start gap-2">
              <span className="capitalize text-swapBox">your positions</span>
              <div className="flex flex-col items-end justify-start gap-1">
                <div>
                  <span className="text-swapBox">
                    {!!pair ? toSF(token0Deposited) : 0.0}
                  </span>{" "}
                  <span>{pair?.token0.symbol}</span>
                </div>

                <div>
                  <span className="text-swapBox">
                    {!!pair ? toSF(token1Deposited) : 0.0}
                  </span>{" "}
                  <span>{pair?.token1.symbol}</span>
                </div>
              </div>
            </div>
          </div>

          <Divider className="bg-swapBox" />

          <div>
            <div className="flex justify-between">
              <p>Stake {percentage * 100}%</p>
            </div>
          </div>

          <Slider
            onChange={(value) => setPercentage((value as number) / 100)}
            size="md"
            step={25}
            maxValue={100}
            minValue={0}
            aria-label="Temperature"
            defaultValue={percentage}
            color="warning"
            classNames={{
              mark: "w-max",
              track: "rounded-none border-none h-[8px]",
              thumb: "flex-shrink-0 bg-btn-primary",
              filler: "bg-btn-primary",
            }}
            marks={[
              {
                value: 0,
                label: "0%",
              },
              {
                value: 25,
                label: "25%",
              },
              {
                value: 50,
                label: "50%",
              },
              {
                value: 75,
                label: "75%",
              },
              {
                value: 100,
                label: "100%",
              },
            ]}
          />
        </div>

        {isConnected ? (
          <>
            {gaugeId !== zeroAddress ? (
              <>
                {allowedToSpend >= stakable ? (
                  <Button
                    variant="primary"
                    disabled={depositPending || stakable <= 0}
                    onClick={() => deposit(parseUnits(stakable.toString(), 18))}
                    className="w-full capitalize"
                    isLoading={depositPending}
                  >
                    stake
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    disabled={approvalPending}
                    onClick={executeApproval}
                    className="w-full capitalize"
                    isLoading={approvalPending}
                  >
                    allow {poolSymbol}
                  </Button>
                )}
              </>
            ) : (
              <Button
                disabled={createGaugePending || gaugeId !== zeroAddress}
                onClick={() => createGauge(params.poolId)}
                variant="primary"
                className="w-full capitalize"
                isLoading={createGaugePending}
              >
                create stake vault
              </Button>
            )}
          </>
        ) : (
          <ConnectButton className="w-full" />
        )}
      </div>

      <TransactionInfoModal
        isOpen={showTXInfoModal}
        close={() => {
          setShowTXInfoModal(false);
          if (typeof createGaugeHash !== "undefined") {
            resetCreateGauge();
          }

          if (typeof depositHash !== "undefined") {
            resetDeposit();
          }
        }}
        type={
          createGaugeSuccess || depositSuccess
            ? "success"
            : createGaugeErrored || depositError
              ? "failure"
              : "failure"
        }
        txHash={createGaugeHash ?? depositHash}
      />
    </div>
  );
};

export default Page;
