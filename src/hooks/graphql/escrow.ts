import { __ESCROW__GRAPH__URLs__ } from "@/config/constants";
import { execute, IndexLocksDocument, type Lock } from "@/graphclient";
import { useMemo } from "react";
import { createQuery } from "react-query-kit";
import { useAccount, useChainId } from "wagmi";

export function useLocks() {
  const chainId = useChainId();
  const { address } = useAccount();
  const url = useMemo(() => __ESCROW__GRAPH__URLs__[chainId], [chainId]);

  return useMemo(
    () =>
      createQuery({
        queryKey: [`${Date.now()}=${Math.random() * 7000}=locks`],
        fetcher: async (): Promise<Lock[]> => {
          const { data } = await execute(
            IndexLocksDocument,
            { account: address },
            { url },
          );
          return data.locks;
        },
      }),
    [url, address],
  );
}
