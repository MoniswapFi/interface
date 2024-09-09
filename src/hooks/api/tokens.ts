import { TokenType } from "@/types";
import { APIURL } from "@/utils/api";
import { createQuery } from "react-query-kit";

export const useGetTokenLists = createQuery({
    queryKey: ["tokens"],
    fetcher: async (): Promise<TokenType[]> => {
        const url = new APIURL(`/tokens/bartio`);
        const response = await fetch(url);
        return response.json();
    },
});
