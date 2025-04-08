import { NFTMetadata } from "@/types";
import { getTokenlist } from "@/utils/assets";
import { TokenURIReader } from "@/utils/token-uri-reader";
import { createQuery } from "react-query-kit";

export type ERC20ItemType = Awaited<ReturnType<typeof getTokenlist>>[number];

export const useGetTokenLists = createQuery({
  queryKey: ["_tokens_"],
  fetcher: async (variables: { chainId: number }): Promise<ERC20ItemType[]> => {
    return getTokenlist(variables.chainId);
  },
});

export const useGetLockMetadata = createQuery({
  queryKey: ["_lock_metadata__" + `${Date.now()}__${Math.random() * 7000}`],
  fetcher: (variables: { uri: string }): Promise<NFTMetadata> => {
    return TokenURIReader.openURI(variables.uri);
  },
});
