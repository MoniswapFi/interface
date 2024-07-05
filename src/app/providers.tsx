'use client';

import { NextUIProvider } from '@nextui-org/react';
import { FC, PropsWithChildren, useState } from 'react';
import { AsideBar } from './components/Aside';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

import {
  darkTheme,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

type Props = PropsWithChildren;

export const Providers: FC<Props> = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenuOpen = () => {
    setShowMenu(!showMenu);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <NextUIProvider className="flex min-h-svh flex-col">
            <AsideBar showMenu={showMenu} hideMenu={() => setShowMenu(false)} />
            {children}
            <Header toggleMenuOpen={toggleMenuOpen} />
            <Footer />
          </NextUIProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
