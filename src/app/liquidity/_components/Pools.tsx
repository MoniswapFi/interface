import BearIcon from '@/assets/images/Bera.png';
import MoniIcon from '@/assets/images/logo.svg';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/Popover';
import { PoolTypes } from '@/config/constants';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select, SelectItem } from '@nextui-org/react';
import Image from 'next/image';

export const Pools = () => {
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
        <div className="hidden w-[130px] text-right lg:block">
          TVL <Popover content="Popover content here." />
        </div>
        <div className="hidden w-[130px] text-right lg:block">
          {'Fees <24H>'} <Popover content="Popover content here." />
        </div>
        <div className="hidden w-[130px] text-right lg:block">
          {'Volumn <24H>'} <Popover content="Popover content here." />
        </div>
        <div className="hidden w-[130px] text-right lg:block">
          {'APR <24H>'} <Popover content="Popover content here." />
        </div>
        <div className="hidden text-right lg:block">{'Action'}</div>
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

            <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
              <span className="text-textgray lg:hidden">
                TVL <Popover content="Popover content here." />
              </span>
              <span>$9,062,352.53</span>
            </div>
            <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
              <span className="text-textgray lg:hidden">
                {'Fees <24H>'} <Popover content="Popover content here." />
              </span>
              $19,233.02
            </div>
            <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
              <span className="text-textgray lg:hidden">
                {'Volumn <24H>'} <Popover content="Popover content here." />
              </span>
              $7,693,210.16
            </div>
            <div className="flex justify-between lg:block lg:w-[130px] lg:text-right">
              <span className="text-textgray lg:hidden">
                {'APR <24H>'} <Popover content="Popover content here." />
              </span>
              143.95%
            </div>
            <div>
              <Button className="w-full text-btn-primary lg:min-w-0">
                <FontAwesomeIcon icon={faPlus} />{' '}
                <span className="lg:hidden">Add Liquidity</span>
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
};
