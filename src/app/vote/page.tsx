'use client';

import Bear4 from '@/assets/images/bear4.png';
import BearIcon from '@/assets/images/Bera.png';
import Image2 from '@/assets/images/image2.svg';
import MoniIcon from '@/assets/images/logo.svg';
import Rectangle from '@/assets/images/Rectangle_t.svg';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/Popover';
import { PoolTypes } from '@/config/constants';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Select, SelectItem } from '@nextui-org/react';
import Image from 'next/image';
import { useState } from 'react';

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
        className="absolute top-0 w-[200px] lg:right-[250px] lg:w-[250px] xl:right-[350px] xl:w-[300px] 2xl:right-[400px]"
      />
      <Image
        src={Bear4}
        alt="bear"
        className="relative right-0 z-[1] m-auto mt-20 lg:absolute lg:right-[100px] lg:top-10 lg:m-0 xl:right-[200px]"
      />
      <div className="relative space-y-5 pt-10">
        <div className="flex max-w-[520px] flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl md:text-[50px]">
              Vote with{' '}
              <span className="text-gradient from-btn-primary to-gold">
                veMONI
              </span>{' '}
              And
            </h2>

            <h2 className="text-3xl md:text-[50px]">
              Govern the{' '}
              <span className="text-gradient from-btn-primary to-gold">
                Protocol
              </span>
            </h2>
          </div>

          <p className="text-sm text-swapBox md:text-[15px]">
            Voters earn a share of transaction fees and incentives for helping
            govern how emissions are distributed.
          </p>
        </div>

        <div className="flex flex-col justify-between gap-3 bg-footer px-5 py-5 text-sm md:flex-row md:gap-0 md:px-10">
          <div className="flex flex-col gap-3">
            <p className="text-textgray">Total Fees</p>
            <p>$1,564,105.52</p>
          </div>

          <Divider
            orientation="vertical"
            className="h-[1px] bg-textlightgray max-md:w-full md:h-auto"
          />

          <div className="flex flex-col gap-3">
            <p className="text-textgray">Total Incentives</p>
            <p>$1,564,105.52</p>
          </div>

          <Divider
            orientation="vertical"
            className="h-[1px] bg-textlightgray max-md:w-full md:h-auto"
          />

          <div className="flex flex-col gap-3">
            <p className="text-textgray">Total Rewards</p>
            <p>$1,564,105.52</p>
          </div>

          <Divider
            orientation="vertical"
            className="h-[1px] bg-textlightgray max-md:w-full md:h-auto"
          />

          <div className="flex flex-col gap-3">
            <p className="text-textgray">New Emissions</p>
            <p>10,747,755.11</p>
          </div>
        </div>
      </div>

      <p className="mt-10">Select Liquidity Pools for Voting</p>

      <div className="mt-5 space-y-5 bg-footer p-5">
        <div className="items-center justify-between lg:flex">
          <div className="lg:w-[25%]">
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
                return (
                  <SelectItem
                    key={item.key}
                    className="data-[hover=true]:border data-[hover=true]:border-btn-primary data-[hover=true]:bg-transparent data-[hover=true]:text-white"
                  >
                    {item.text}
                  </SelectItem>
                );
              })}
            </Select>
          </div>
          <div className="hidden w-[150px] text-right text-textlightgray lg:block">
            TVL <Popover content="Popover content here." />
          </div>
          <div className="hidden w-[150px] text-right text-textlightgray lg:block">
            {'Fees'}
          </div>
          <div className="hidden w-[150px] text-right text-textlightgray lg:block">
            {'Incentives'} <Popover content="Popover content here." />
          </div>
          <div className="hidden w-[150px] text-right text-textlightgray lg:block">
            {'Total Rewarda'} <Popover content="Popover content here." />
          </div>
          <div className="hidden w-[70px] text-right text-textlightgray lg:block">
            {'vAPR'}
          </div>
        </div>

        {Array.from({ length: 20 }).map((item, index) => {
          return (
            <div
              className="flex flex-col justify-between gap-3 border-t border-swapBox pt-5 lg:flex-row lg:items-center lg:gap-0"
              key={index}
            >
              <div className="flex lg:w-[25%]">
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

              <div className="flex justify-between pb-5 lg:block lg:w-[150px] lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                  TVL <Popover content="Popover content here." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                  <span>$9,062,352.53</span>
                </div>
              </div>
              <div className="flex justify-between pb-5 lg:block lg:w-[150px] lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                  {'APR'} <Popover content="Popover content here." />
                </span>
                <span>$19,233.02</span>
              </div>
              <div className="flex justify-between pb-5 lg:block lg:w-[150px] lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                  {'Your Deposits'} <Popover content="Popover content here." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                  <span>$7,693,210.16</span>
                </div>
              </div>
              <div className="flex justify-between pb-5 lg:block lg:w-[150px] lg:pb-0 lg:text-right">
                <span className="text-textgray lg:hidden">
                  {'Staked'} <Popover content="Popover content here." />
                </span>
                <div className="flex flex-col gap-3 text-right">
                  <span>$536,177.02</span>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 lg:block lg:w-[70px] lg:text-right">
                <div className="flex justify-between pb-5 lg:block lg:pb-0">
                  <span className="text-textgray lg:hidden">vAPR</span>
                  <span>71.31%</span>
                </div>
                <Button
                  className="w-full text-sm lg:w-fit lg:min-w-0"
                  variant="secondary"
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span className="text-btn-primary lg:hidden">Select</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
