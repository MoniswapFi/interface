"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import { ConnectButton } from "@/components/ConnectButton";
import { TransactionInfoModal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { ChipBadge } from "@/components/ui/chipBadge";
import { __PROTOCOL_ROUTERS__ } from "@/config/constants";
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
import { formatEther, formatUnits, parseUnits, zeroAddress } from "viem";
import { useAccount, useChainId, useWatchBlocks } from "wagmi";

type PageProps = {
  params: {
    poolId: string;
  };
};

const Page: FC<PageProps> = ({ params }) => {
  const [percentage, setPercentage] = useState(0.0);
  const [showTXInfoModal, setShowTXInfoModal] = useState(false);

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { data: tokenlist = [] } = useGetTokenLists({ variables: { chainId } });

  const { usePoolFee } = useProtocolCore();
  const { usePoolSymbol, usePoolTotalSupply, usePoolStability } =
    usePoolMetadata(params.poolId as any);
  const { data: stable = false } = usePoolStability();
  const { data: fee } = usePoolFee(params.poolId as any, stable);
  const { data: poolSymbol } = usePoolSymbol();
  const { data: poolTotalSupply } = usePoolTotalSupply();
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

  const { useGetPoolGauge } = useVoterCore();
  const { data: gaugeId = zeroAddress, refetch: refetchGaugeId } =
    useGetPoolGauge(params.poolId);
  const router = useMemo(() => __PROTOCOL_ROUTERS__[chainId], [chainId]);
  const { useRemoveLiquidity } = useProtocolCore();

  const { useAllowance, useApproval } = useERC20Allowance(params.poolId as any);

  const { data: allowance, refetch: refetchAllowance } = useAllowance(
    router as any,
  );

  const allowedToSpend = useMemo(
    () => Number(formatUnits(allowance ?? BigInt(0), 18)),
    [allowance],
  );

  const removable = useMemo(
    () => percentage * position,
    [percentage, position],
  );

  const { executeApproval, isPending: approvalPending } = useApproval(
    router as any,
    Number(parseUnits(removable.toString(), 18)),
  );

  const { useGaugeReadables } = useGaugeCore();
  const {
    executeRemoveLiquidity,
    isError: withdrawError,
    isSuccess: withdrawSuccess,
    isPending: withdrawPending,
    hash: withdrawHash,
    reset: resetWithdraw,
  } = useRemoveLiquidity(
    (token0?.address ?? "") as any,
    (token1?.address ?? "") as any,
    stable,
    Number(parseUnits(removable.toString(), 18)),
    () => setShowTXInfoModal(true),
  );
  const { useRewardRate } = useGaugeReadables(gaugeId);
  const { data: rewardRate = BigInt(0), refetch: refetchRewardRate } =
    useRewardRate();

  useWatchBlocks({
    onBlock: async () => {
      await refetchGaugeId();
      await refetchPair();
      await refetchRewardRate();
      await refetchAllowance();
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
              <p>{toSF(formatEther(rewardRate))}%</p>
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
              <p>Withdraw {percentage * 100}%</p>
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
            {allowedToSpend >= removable ? (
              <Button
                onClick={executeRemoveLiquidity}
                isLoading={withdrawPending}
                disabled={withdrawPending || removable <= 0}
                variant="primary"
                className="w-full capitalize"
              >
                withdraw
              </Button>
            ) : (
              <Button
                onClick={executeApproval}
                isLoading={approvalPending}
                disabled={approvalPending}
                variant="primary"
                className="w-full capitalize"
              >
                allow {poolSymbol}
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
          resetWithdraw();
        }}
        type={
          withdrawSuccess ? "success" : withdrawError ? "failure" : "failure"
        }
        txHash={withdrawHash}
      />
    </div>
  );
};

export default Page;
