'use client';

import { useGetTokenLists } from '@/hooks/api/tokens';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Select, SelectItem } from '@nextui-org/react';

export default function Page() {
  const { data: tokenLists = [] } = useGetTokenLists({});

  return (
    <div className="mx-auto flex max-w-[1300px] flex-col gap-10 px-5 pb-10 pt-10 md:pt-36">
      <p className="text-2xl">Deposit Liquidity</p>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        <div className="flex flex-1 flex-col gap-5 bg-footer p-5">
          <div>First Token</div>

          <Select
            label="Select Token"
            className="max-w-xs"
            radius="none"
            classNames={{
              trigger:
                'bg-transparent data-[hover=true]:bg-transparent border border-swapBox',
              listbox: 'bg-footer',
              listboxWrapper: 'bg-footer',
              popoverContent:
                'p-0 bg-footer border rounded-none border-swapBox',
              label: 'hidden',
              base: '!m-0 !max-w-full',
              value: '!text-white',
            }}
            labelPlacement="outside"
          >
            {tokenLists.map((token, index) => {
              return (
                <SelectItem
                  key={token.symbol}
                  classNames={{
                    base: 'data-[selectable=true]:bg-footer data-[hover=true]:bg-footer data-[hover=true]:text-white',
                  }}
                  startContent={<Avatar src={token.logoURI} />}
                >
                  {token.symbol}
                </SelectItem>
              );
            })}
          </Select>
        </div>

        <div className="flex flex-1 flex-col gap-5 bg-footer p-5">
          <div>Second Token</div>

          <Select
            label="Select Token"
            className="max-w-xs"
            radius="none"
            classNames={{
              trigger:
                'bg-transparent data-[hover=true]:bg-transparent border border-swapBox',
              listbox: 'bg-footer',
              listboxWrapper: 'bg-footer',
              popoverContent:
                'p-0 bg-footer border rounded-none border-swapBox',
              label: 'hidden',
              base: '!m-0 !max-w-full',
              value: '!text-white',
            }}
            labelPlacement="outside"
          >
            {tokenLists.map((token, index) => {
              return (
                <SelectItem
                  key={token.symbol}
                  classNames={{
                    base: 'data-[selectable=true]:bg-footer data-[hover=true]:bg-footer data-[hover=true]:text-white',
                  }}
                  startContent={<Avatar src={token.logoURI} />}
                >
                  {token.symbol}
                </SelectItem>
              );
            })}
          </Select>
        </div>
      </div>

      <div className="flex gap-3 bg-footer px-5 py-3 text-textgray md:items-center">
        <span className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full border border-textgray">
          <FontAwesomeIcon icon={faInfo} size="xs" />
        </span>
        Start by selecting the tokens. The liquidity pools available for deposit
        will show up next.
      </div>
    </div>
  );
}
