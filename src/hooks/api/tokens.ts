import { __API_CHAIN_NAMES__ } from "@/config/constants";
import { NFTMetadata, TokenType } from "@/types";
import { APIURL } from "@/utils/api";
import { TokenURIReader } from "@/utils/token-uri-reader";
import { createQuery } from "react-query-kit";

export const useGetTokenLists = createQuery({
  queryKey: ["_tokens_"],
  fetcher: async (variables: { chainId: number }): Promise<TokenType[]> => {
    const chainName = __API_CHAIN_NAMES__[variables.chainId];
    const url = new APIURL(`/tokens/${chainName}`);
    const response = await fetch(url);
    return response.json();
  },
});

export const useGetLockMetadata = createQuery({
  queryKey: ["_lock_metadata__" + `${Date.now()}__${Math.random() * 7000}`],
  fetcher: (variables: { uri: string }): Promise<NFTMetadata> => {
    return TokenURIReader.openURI(variables.uri);
  },
});
