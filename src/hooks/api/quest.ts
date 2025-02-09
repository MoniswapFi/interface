import { APIURL } from "@/utils/api";
import { createMutation, createQuery } from "react-query-kit";
import { Address } from "viem";

type CreatQuestVariables = {
  address: Address;
  reason: string;
  points: number;
};

export const useCreateQuests = createMutation({
  mutationKey: ["addQuests"],
  mutationFn: async (variables: CreatQuestVariables): Promise<any> => {
    const url = new APIURL(`/quest/create`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: variables.address,
        reason: variables.reason,
        points: variables.points,
      }),
    });

    const data = await response.json();
    return data;
  },
});

type GetQuestListsVariables = {
  address: Address;
};

type Quest = {
  address: Address;
  reason: string;
  points: number;
};

export const useGetUserQuestLists = createQuery({
  queryKey: ["questLists"],
  fetcher: async (variables: GetQuestListsVariables): Promise<Quest[]> => {
    try {
      if (!variables.address) return [];
      const url = new APIURL(`/quest/${variables.address}`);
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      return [];
    }
  },
});
