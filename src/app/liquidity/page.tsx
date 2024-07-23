'use client';

import Bear2 from '@/assets/images/bear2.png';
import Bear5 from '@/assets/images/bear5.png';
import Bear6 from '@/assets/images/bear6.png';
import BearIcon from '@/assets/images/Bera.png';
import MoniIcon from '@/assets/images/logo.svg';
import { Button } from '@/components/ui/button';
import { Select, SelectItem, Tab, Tabs } from '@nextui-org/react';
import { RotateCw } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="space-y-10 p-5 md:p-20">
      <div className="relative space-y-5">
        <Image
          src={Bear6}
          alt="bear"
          className="-top-[70px] right-0 md:absolute"
        />
        <div className="max-w-[520px]">
          <h2 className="text-3xl md:text-[50px]">
            Add{' '}
            <span className="text-gradient from-btn-primary to-gold">
              Liquidity
            </span>
          </h2>

          <h2 className="text-3xl md:text-[50px]">
            or Create a{' '}
            <span className="text-gradient from-btn-primary to-gold">Pool</span>
          </h2>

          <p className="text-sm text-swapBox md:text-[15px]">
            Liquidity Providers (LPs) make low-slippage swaps possible. Deposit
            and Stake liquidity to earn MONI.
          </p>
        </div>

        <div className="flex flex-col gap-7 md:flex-row">
          <div className="flex items-center justify-around bg-gradient-to-r from-footer to-darkGold py-2 md:w-[300px]">
            <div>
              <p className="text-xl">$114,525,813.45</p>
              <p className="text-textgray">Total Value Locked</p>
            </div>

            <div>
              <Image src={Bear2} alt="image" width={80} />
            </div>
          </div>

          <div className="flex items-center justify-around bg-gradient-to-r from-footer to-darkGold py-2 md:w-[300px]">
            <div>
              <p className="text-xl">$16,328,705.38</p>
              <p className="text-textgray">Trading Volume (24H)</p>
            </div>

            <div>
              <Image src={Bear5} alt="image" width={80} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 bg-footer p-5">
        <div className="flex items-center justify-between">
          <div className="flex gap-5">
            <Button variant="primary" size="md">
              Create Pool
            </Button>
            <Button size="md">Add Liquidity</Button>
          </div>

          <div className="rounded-full border border-swapBox p-2 text-navDefault">
            <RotateCw />
          </div>
        </div>

        <Tabs
          variant={'underlined'}
          aria-label="Tabs variants"
          classNames={{
            base: 'w-full',
            tabList: 'w-full border-b border-swapBox p-0',
            tab: 'p-0 py-7',
            tabContent:
              'text-white group-data-[selected=true]:text-white text-lg',
            cursor: 'border-b-3 border-btn-primary w-full',
          }}
        >
          <Tab key="pools" title="Pools" />
          <Tab key="position" title="My Position" />
        </Tabs>

        <div>
          <Select label="Select an animal" className="w-full">
            <SelectItem key={'test'}>{'sdf'}</SelectItem>
          </Select>
        </div>

        <div className="border-t border-swapBox">
          <div className="flex">
            <span className="flex">
              <Image src={BearIcon} alt="icon" width={30} />
              <Image src={MoniIcon} alt="icon" width={30} />
            </span>
            <span>vAMM-MONI/BERA</span>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex justify-between">
              <span>TVL</span>
              <span>$9,062,352.53</span>
            </div>

            <div className="flex justify-between">
              <span>Fees (24H)</span>
              <span>$19,233.02</span>
            </div>

            <div className="flex justify-between">
              <span>Volume (24H)</span>
              <span>$7,693,210.16</span>
            </div>

            <div className="flex justify-between">
              <span>APR (24H)</span>
              <span>143.95%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
