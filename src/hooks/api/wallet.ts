import { APIURL } from "@/utils/api";
import { createMutation } from "react-query-kit";
import { Address } from "viem";

type CreateWalletVariables = {
    address: Address;
};

export const useCreateWallet = createMutation({
    mutationKey: ["wallet"],
    mutationFn: async (variables: CreateWalletVariables): Promise<any> => {
        const url = new APIURL(`/wallet/create`);
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: variables.address,
            }),
        });

        const data = await response.json();
        return data;
    },
});
