'use client';

import { NextUIProvider } from '@nextui-org/react';
import { FC, PropsWithChildren, useState } from 'react';
import { AsideBar } from './components/Aside';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

type Props = PropsWithChildren;

export const Providers: FC<Props> = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenuOpen = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NextUIProvider className="flex min-h-svh flex-col">
      <AsideBar showMenu={showMenu} hideMenu={() => setShowMenu(false)} />
      {children}
      <Header toggleMenuOpen={toggleMenuOpen} />
      <Footer />
    </NextUIProvider>
  );
};
