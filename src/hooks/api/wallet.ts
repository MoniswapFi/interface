import { APIURL } from "@/utils/api";
import { createMutation, createQuery } from "react-query-kit";
import { Address } from "viem";

type GetWalletVariables = {
  address: Address;
};

export type Wallet = {
  address: Address;
  points: number;
  refCode?: string;
};

export const useGetWallet = createQuery({
  queryKey: ["getWallet"],
  fetcher: async (variables: GetWalletVariables): Promise<Wallet | null> => {
    try {
      if (!variables.address) return null;
      const url = new APIURL(`/wallet/${variables.address}`);
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      return null;
    }
  },
});

type Rank = {
  rank: number;
};

export const useGetWalletRank = createQuery({
  queryKey: ["getWalletRank"],
  fetcher: async (variables: GetWalletVariables): Promise<Rank | null> => {
    try {
      if (!variables.address) return null;
      const url = new APIURL(`/wallet/rank/${variables.address}`);
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      return null;
    }
  },
});

type CreateWalletVariables = {
  address: Address;
  referral?: string;
};

export const useCreateWallet = createMutation({
  mutationKey: ["createWallet"],
  mutationFn: async (variables: CreateWalletVariables): Promise<any> => {
    const url = new APIURL(`/wallet/create`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: variables.address,
        referral: variables.referral,
      }),
    });

    const data = await response.json();
    return data;
  },
});

type AddWalletPointsVariables = {
  address: Address;
  points: number;
};

export const useAddWalletPoints = createMutation({
  mutationKey: ["addWalletPoints"],
  mutationFn: async (variables: AddWalletPointsVariables): Promise<any> => {
    const url = new APIURL(`/wallet/addPoints`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: variables.address,
        points: variables.points,
      }),
    });

    const data = await response.json();
    return data;
  },
});
