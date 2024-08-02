'use client';

import Bear2 from '@/assets/images/bear2.png';
import Bear5 from '@/assets/images/bear5.png';
import Bear6 from '@/assets/images/bear6.png';
import BearIcon from '@/assets/images/Bera.png';
// import Image2 from '@/assets/images/image2.svg';
import MoniIcon from '@/assets/images/logo.svg';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/Popover';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select, SelectItem, Tab, Tabs } from '@nextui-org/react';
import { RotateCw } from 'lucide-react';
import Image from 'next/image';

const PoolTypes = [
  {
    key: 'all',
    text: 'All Pools',
  },
  {
    key: 'stable',
    text: 'Stable',
  },
  {
    key: 'volatile',
    text: 'Volatile',
  },
  {
    key: 'concentrated',
    text: 'Concentrated',
  },
  {
    key: 'incentivized',
    text: 'Incentivized',
  },
  {
    key: 'low',
    text: 'Low TVL',
  },
];

export default function Page() {
  return (
    <div className="space-y-10 p-5 md:p-20">
      <div className="relative space-y-5">
        <Image
          src={Bear6}
          alt="bear"
          className="-top-[90px] right-0 md:absolute"
        />
        {/* <Image
          src={Image2}
          alt="image"
          className="absolute -top-[100px] w-[300px] xl:right-[350px] 2xl:right-[400px]"
        /> */}
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
        <div className="flex items-center justify-between border-b border-swapBox">
          <Tabs
            variant={'underlined'}
            aria-label="Tabs variants"
            classNames={{
              base: 'w-fit',
              tabList: 'w-full border-none p-0 ',
              tab: 'p-0 py-7 w-[130px]',
              tabContent:
                'text-white group-data-[selected=true]:text-white text-lg',
              cursor: 'border-b-3 border-btn-primary w-full',
            }}
          >
            <Tab key="pools" title="Pools" />
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

        <div className="flex items-center justify-between">
          <div className="w-[25%]">
            <Select
              label="Select an animal"
              classNames={{
                trigger:
                  'bg-transparent data-[hover=true]:bg-transparent border border-btn-primary',
                listbox: 'bg-footer',
                listboxWrapper: 'bg-footer',
                popoverContent:
                  'p-0 bg-footer border rounded-none border-btn-primary',
                label: 'hidden',
                base: '!m-0',
                value: '!text-white',
              }}
              radius="none"
              defaultSelectedKeys={'all'}
              labelPlacement="outside"
            >
              {PoolTypes.map((item, index) => {
                return <SelectItem key={item.key}>{item.text}</SelectItem>;
              })}
            </Select>
          </div>
          <div className="text-right">
            TVL <Popover content="Popover content here." />
          </div>
          <div className="text-right">
            {'Fees <24H>'} <Popover content="Popover content here." />
          </div>
          <div className="text-right">
            {'Volumn <24H>'} <Popover content="Popover content here." />
          </div>
          <div className="text-right">
            {'APR <24H>'} <Popover content="Popover content here." />
          </div>
          <div className="text-right">{'Action'}</div>
        </div>

        {Array.from({ length: 20 }).map((item, index) => {
          return (
            <div
              className="flex items-center justify-between border-t border-swapBox pt-5"
              key={index}
            >
              <div className="flex w-[25%]">
                <div className="flex items-center">
                  <Image src={BearIcon} alt="icon" width={30} />
                  <Image
                    src={MoniIcon}
                    alt="icon"
                    width={30}
                    className="-translate-x-3"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm">vAMM-MONI/BERA</span>
                  <span className="bg-darkgray p-1 text-xs text-lightblue">
                    Basic Volatile • 1.0%
                  </span>
                </div>
              </div>

              <div>$9,062,352.53</div>
              <div>$19,233.02</div>
              <div>$7,693,210.16</div>
              <div>143.95%</div>
              <div>
                <Button className="min-w-0">
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <Button>View More</Button>
      </div>
    </div>
  );
}
