"use client";

import { berachain } from "@/config/_appkit";
import { persistor, store } from "@/store";
import { NextUIProvider } from "@nextui-org/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  type AppKitNetwork,
  berachainTestnetbArtio,
} from "@reown/appkit/networks";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { hashFn } from "@wagmi/core/query";
import { FC, PropsWithChildren, useCallback, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
  WagmiProvider,
  cookieStorage,
  cookieToInitialState,
  createStorage,
} from "wagmi";
import { AsideBar } from "../components/Aside";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const networks = [berachain, berachainTestnetbArtio] as [
  AppKitNetwork,
  ...AppKitNetwork[],
];

const adapter = new WagmiAdapter({
  multiInjectedProviderDiscovery: true,
  networks,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string,
  ssr: false,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
    },
  },
});

createAppKit({
  adapters: [adapter],
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string,
  networks,
  defaultNetwork: berachain,
  themeMode: "dark",
});

const web3Config = adapter.wagmiConfig;

type Props = PropsWithChildren & { cookies: string | null };

const Providers: FC<Props> = ({ children, cookies }) => {
  const [showMenu, setShowMenu] = useState(false);
  const initialState = cookieToInitialState(web3Config, cookies);

  const toggleMenuOpen = useCallback(() => setShowMenu(!showMenu), [showMenu]);

  return (
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <WagmiProvider config={web3Config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <NextUIProvider className="flex min-h-svh flex-col">
              <AsideBar
                showMenu={showMenu}
                hideMenu={() => setShowMenu(false)}
              />
              {children}
              <Header toggleMenuOpen={toggleMenuOpen} />
              <Footer />
            </NextUIProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default Providers;
