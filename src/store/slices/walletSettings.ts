import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WalletSettingsSliceInterface {
  slippageTolerance: number;
  executionDeadlineInMinutes: number;
  swapRoutingSteps: 1 | 2 | 3 | 4;
}

const initialState: WalletSettingsSliceInterface = {
  slippageTolerance: 0.5,
  executionDeadlineInMinutes: 30,
  swapRoutingSteps: 4,
};

const createWalletSettingsSlice = createSlice({
  name: "Wallet Settings",
  initialState,
  reducers: {
    changeSlippageTolerance: (state, action: PayloadAction<number>) => {
      state.slippageTolerance = action.payload;
    },
    changeExecutionDeadlineInMinutes: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.executionDeadlineInMinutes = action.payload;
    },
    changeSwapRoutingSteps: (state, action: PayloadAction<1 | 2 | 3 | 4>) => {
      state.swapRoutingSteps = action.payload;
    },
  },
});

export const {
  changeSlippageTolerance,
  changeExecutionDeadlineInMinutes,
  changeSwapRoutingSteps,
} = createWalletSettingsSlice.actions;
export default createWalletSettingsSlice.reducer;
