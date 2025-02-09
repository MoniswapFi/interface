import { APIURL } from "@/utils/api";
import { createQuery } from "react-query-kit";
import { Address } from "viem";

type GetUserReferredCountVariable = {
  address: Address;
};

export const useGetUserReferredCount = createQuery({
  queryKey: ["referredcount"],
  fetcher: async (variables: GetUserReferredCountVariable): Promise<number> => {
    try {
      if (!variables.address) return 0;
      const url = new APIURL(
        `/leaderboard/getRefferedCount/${variables.address}`,
      );
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      return 0;
    }
  },
});

export const useGetUserVerifiedCount = createQuery({
  queryKey: ["verifiedcount"],
  fetcher: async (variables: GetUserReferredCountVariable): Promise<number> => {
    try {
      if (!variables.address) return 0;
      const url = new APIURL(
        `/leaderboard/getVerifiedCount/${variables.address}`,
      );
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      return 0;
    }
  },
});

export type LeaderboardList = {
  address: Address;
  points: number;
  refCode?: string;
  referrer?: string;
  leaderboardCount: number;
};

export const useGetAllLeaderboardLists = createQuery({
  queryKey: ["allleaderboardlists"],
  fetcher: async (): Promise<LeaderboardList[]> => {
    try {
      const url = new APIURL("/leaderboard/getAllLists");
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      return [];
    }
  },
});
