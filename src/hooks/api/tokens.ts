import { NFTMetadata, TokenType } from "@/types";
import { APIURL } from "@/utils/api";
import { TokenURIReader } from "@/utils/token-uri-reader";
import { createQuery } from "react-query-kit";

export const useGetTokenLists = createQuery({
  queryKey: ["tokens"],
  fetcher: async (): Promise<TokenType[]> => {
    const url = new APIURL(`/tokens/bartio`);
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
