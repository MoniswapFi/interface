import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WalletSettingsSliceInterface {
    slippageTolerance: number;
    executionDeadlineInMinutes: number;
}

const initialState: WalletSettingsSliceInterface = {
    slippageTolerance: 0.5,
    executionDeadlineInMinutes: 30,
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
    },
});

export const { changeSlippageTolerance, changeExecutionDeadlineInMinutes } =
    createWalletSettingsSlice.actions;
export default createWalletSettingsSlice.reducer;
