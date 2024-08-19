'use client';

import BearIcon from '@/assets/images/Bera.png';
import MoniIcon from '@/assets/images/logo.svg';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/Popover';
import { PoolTypes } from '@/config/constants';
import { Select, SelectItem } from '@nextui-org/react';
import Image from 'next/image';

export const MyPosition = () => {
  return (
    <>
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
        <div className="hidden w-[150px] text-right lg:block">
          TVL <Popover content="Popover content here." />
        </div>
        <div className="hidden w-[80px] text-right lg:block">{'APR'}</div>
        <div className="hidden w-[150px] text-right lg:block">
          {'Your Deposits'} <Popover content="Popover content here." />
        </div>
        <div className="hidden w-[130px] text-right lg:block">
          {'Staked'} <Popover content="Popover content here." />
        </div>
        <div className="hidden w-[150px] text-right lg:block">{'Action'}</div>
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

            <div className="flex justify-between border-b border-swapBox pb-5 lg:block lg:w-[150px] lg:border-none lg:pb-0 lg:text-right">
              <span className="text-textgray lg:hidden">
                TVL <Popover content="Popover content here." />
              </span>
              <div className="flex flex-col gap-3 text-right">
                <span>$9,062,352.53</span>
                <span className="text-textgray">3,968,846.78 BERA</span>
                <span className="text-textgray">6,734,556.78 MONI</span>
              </div>
            </div>
            <div className="flex justify-between pb-5 lg:block lg:w-[80px] lg:pb-0 lg:text-right">
              <span className="text-textgray lg:hidden">
                {'APR'} <Popover content="Popover content here." />
              </span>
              190.67%
            </div>
            <div className="flex justify-between border-b border-swapBox pb-5 lg:block lg:w-[130px] lg:border-none lg:pb-0 lg:text-right">
              <span className="text-textgray lg:hidden">
                {'Your Deposits'} <Popover content="Popover content here." />
              </span>
              <div className="flex flex-col gap-3 text-right">
                <span>$2,352.53</span>
                <span className="text-textgray">346.78 BERA</span>
                <span className="text-textgray">34,556.78 MONI</span>
              </div>
            </div>
            <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
              <span className="text-textgray lg:hidden">
                {'Staked'} <Popover content="Popover content here." />
              </span>
              <div className="flex flex-col gap-3 text-right">
                <span>$2,352.53</span>
                <span className="text-textgray">0.00 BERA</span>
                <span className="text-textgray">0.00 MONI</span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 lg:w-[150px]">
              <Button className="w-full text-sm lg:min-w-0" variant="primary">
                <span>Stake Deposit</span>
              </Button>
              <Button className="w-full text-sm text-btn-primary lg:min-w-0">
                <span>Withdraw Deposit</span>
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
};
