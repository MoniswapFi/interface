import CongratesIcon from '@/assets/images/congrates.svg';
import Logo from '@/assets/images/logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import { ConnectButton } from '../ConnectButton';

const NavItems = [
  {
    name: 'Swap',
    href: '/swap',
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
  },
  {
    name: 'Liquidity',
    href: '/liquidity',
  },
  {
    name: 'Vote',
    href: '/vote',
  },
  {
    name: 'Lock',
    href: '/lock',
  },
  {
    name: 'Incentives',
    href: '/incentives',
  },
];

export const Header = () => {
  return (
    <div className="sticky bottom-0">
      <div className="flex items-center justify-center gap-2 bg-secondary py-4">
        <Image src={CongratesIcon} alt="icon" />
        <p>Moniswap V1 Live on Bartio Testnet. Swap Now!</p>
      </div>

      <div className="bg-header py-4">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-10">
          <Link href={'/'}>
            <Image src={Logo} alt="icon" />
          </Link>
          <div className="flex justify-center gap-7">
            {NavItems.map((item, index) => {
              return (
                <Link key={index} href={item.href}>
                  {item.name}
                </Link>
              );
            })}
          </div>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};
