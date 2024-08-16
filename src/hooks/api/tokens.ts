import { APIURL } from "@/utils/api";
import { createQuery } from "react-query-kit";
import { TokenType } from "../../types";

export const useGetTokenLists = createQuery({
    queryKey: ["points"],
    fetcher: async (): Promise<TokenType[]> => {
        const url = new APIURL(`/tokens/bartio`);
        const response = await fetch(url);
        return response.json();
    },
});
