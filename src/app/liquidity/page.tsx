'use client';

import Bear2 from '@/assets/images/bear2.png';
import Bear5 from '@/assets/images/bear5.png';
import Bear6 from '@/assets/images/bear6.png';
import Image2 from '@/assets/images/image2.svg';
import Rectangle from '@/assets/images/Rectangle_t.svg';
import { Button } from '@/components/ui/button';
import { Chip, Tab, Tabs } from '@nextui-org/react';
import { RotateCw } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { MyPosition } from './_components/MyPosition';
import { Pools } from './_components/Pools';

export default function Page() {
  const [selectedTab, setSelectedTab] = useState('pools');

  return (
    <div className="relative overflow-hidden p-5 md:p-20">
      <Image
        src={Rectangle}
        alt="image"
        className="absolute -right-[100px] -top-[100px] w-[250px] lg:w-[200px]"
      />
      <Image
        src={Image2}
        alt="image"
        className="absolute top-0 w-[200px] lg:right-[350px] lg:w-[300px] xl:right-[350px] 2xl:right-[400px]"
      />
      <Image
        src={Bear6}
        alt="bear"
        className="relative right-0 z-[1] m-auto mt-20 lg:absolute lg:right-20 lg:top-10 lg:m-0"
      />
      <div className="relative space-y-5 pt-10">
        <div className="flex max-w-[520px] flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl md:text-[50px]">
              Add{' '}
              <span className="text-gradient from-btn-primary to-gold">
                Liquidity
              </span>
            </h2>

            <h2 className="text-3xl md:text-[50px]">
              or Create a{' '}
              <span className="text-gradient from-btn-primary to-gold">
                Pool
              </span>
            </h2>
          </div>

          <p className="text-sm text-swapBox md:text-[15px]">
            Liquidity Providers (LPs) make low-slippage swaps possible. Deposit
            and Stake liquidity to earn MONI.
          </p>
        </div>

        <div className="flex flex-col gap-7 md:flex-row">
          <div className="flex items-center justify-around bg-gradient-to-r from-footer to-darkGold py-2 md:w-[50%] lg:w-[300px]">
            <div>
              <p className="text-xl">$114,525,813.45</p>
              <p className="text-textgray">Total Value Locked</p>
            </div>

            <div>
              <Image src={Bear2} alt="image" width={80} />
            </div>
          </div>

          <div className="flex items-center justify-around bg-gradient-to-r from-footer to-darkGold py-2 md:w-[50%] lg:w-[300px]">
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

      <div className="mt-10 space-y-5 bg-footer p-5">
        <div className="flex flex-col-reverse items-center justify-between border-b border-swapBox md:flex-row">
          <Tabs
            variant={'underlined'}
            aria-label="Options"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            classNames={{
              base: 'w-fit',
              tabList: 'w-full border-none p-0 ',
              tab: 'p-0 py-7 w-[130px]',
              tabContent:
                'text-white group-data-[selected=true]:text-white text-lg',
              cursor: 'border-b-3 border-btn-primary w-full',
            }}
          >
            <Tab
              key="pools"
              title={
                <span>
                  Pools{' '}
                  <Chip
                    radius="none"
                    classNames={{
                      base: 'bg-darkgray text-xs text-lightblue p-1 h-fit w-fit',
                    }}
                  >
                    158
                  </Chip>
                </span>
              }
            />
            <Tab key="position" title="My Position" />
          </Tabs>
          <div className="flex items-center gap-2">
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
        </div>

        {selectedTab === 'pools' ? <Pools /> : <MyPosition />}
      </div>

      <div className="mt-10 text-center">
        <Button>View More</Button>
      </div>
    </div>
  );
}
