import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface VotingSliceInterface {
  selectedPools: string[];
  weights: number[];
  weight: Record<string, number>;
}

const initialState: VotingSliceInterface = {
  selectedPools: [],
  weights: [],
  weight: {},
};

const votingSlice = createSlice({
  name: "Voting",
  initialState,
  reducers: {
    selectPoolForVoting: (state, action: PayloadAction<[string, number]>) => {
      state.selectedPools = state.selectedPools.concat(action.payload[0]);
      state.weights = state.weights.concat(action.payload[1]);
      state.weight = {
        ...state.weight,
        [action.payload[0]]: action.payload[1],
      };
    },
    deselectPoolFromVoting: (state, action: PayloadAction<string>) => {
      const poolIndex = state.selectedPools.indexOf(action.payload);
      state.selectedPools = state.selectedPools.filter(
        (pool) => pool !== action.payload,
      );
      state.weights = state.weights.filter((_, index) => index !== poolIndex);

      delete state.weight[action.payload];
    },
    changePoolWeight: (state, action: PayloadAction<[string, number]>) => {
      const poolIndex = state.selectedPools.indexOf(action.payload[0]);
      state.weights.splice(poolIndex, 1, action.payload[1]);
      state.weight[action.payload[0]] = action.payload[1];
    },
    resetVotingValues: (state) => {
      state.selectedPools = [];
      state.weight = {};
      state.weights = [];
    },
  },
});

export const {
  selectPoolForVoting,
  deselectPoolFromVoting,
  changePoolWeight,
  resetVotingValues,
} = votingSlice.actions;
export default votingSlice.reducer;
