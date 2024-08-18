import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import walletSettingsReducer from "./slices/walletSettings";

const persistConfig = {
    key: "root",
    storage,
};

const persistedWalletSettingsReducer = persistReducer(
    persistConfig,
    walletSettingsReducer,
);

export const store = configureStore({
    devTools: process.env.NODE_ENV !== "production",
    reducer: {
        wallet: persistedWalletSettingsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
