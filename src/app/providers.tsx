"use client";

import { NextUIProvider } from "@nextui-org/react";
import { FC, PropsWithChildren, useState } from "react";
import { AsideBar } from "../components/Aside";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

import { persistor, store } from "@/store";
import {
    darkTheme,
    getDefaultConfig,
    RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { WagmiProvider } from "wagmi";
import { berachainTestnetbArtio } from "wagmi/chains";

const web3Config = getDefaultConfig({
    appName: "MoniswapFi",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string,
    chains: [berachainTestnetbArtio],
    ssr: true,
});

const queryClient = new QueryClient();

type Props = PropsWithChildren;

export const Providers: FC<Props> = ({ children }) => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenuOpen = () => {
        setShowMenu(!showMenu);
    };

    return (
        <ReduxProvider store={store}>
            <PersistGate persistor={persistor}>
                <WagmiProvider config={web3Config}>
                    <QueryClientProvider client={queryClient}>
                        <RainbowKitProvider theme={darkTheme()}>
                            <NextUIProvider className="flex min-h-svh flex-col">
                                <AsideBar
                                    showMenu={showMenu}
                                    hideMenu={() => setShowMenu(false)}
                                />
                                {children}
                                <Header toggleMenuOpen={toggleMenuOpen} />
                                <Footer />
                            </NextUIProvider>
                        </RainbowKitProvider>
                    </QueryClientProvider>
                </WagmiProvider>
            </PersistGate>
        </ReduxProvider>
    );
};
