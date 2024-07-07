'use client';

import BEAR1 from '@/assets/images/Bear1.png';
import BeraLogo from '@/assets/images/Bera.png';
import Logo from '@/assets/images/logo.svg';
import SwapIcon from '@/assets/images/swapIcon.svg';
import { ConnectButton } from '@/components/ConnectButton';
import { TokenSelectModal } from '@/components/TokenSelectModal';
import { Button } from '@/components/ui/button';
import { Divider, Input } from '@nextui-org/react';
import { ArrowRightLeft, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const { isConnected } = useAccount();
  return (
    <div className="p-5 pb-20">
      <Image
        src={BEAR1}
        alt="bear"
        className="absolute left-[50%] top-0 translate-x-[-50%]"
        width={350}
      />
      <div className="z-1 relative m-auto mt-32 flex max-w-[620px] flex-col gap-10">
        <div className="flex w-full flex-col gap-10 bg-footer p-8">
          <div className="flex flex-col gap-3 text-sm sm:text-base">
            <p className="flex justify-between">
              <span>Swap</span>
              <span className="text-swapBox">Available 0.0 MONI</span>
            </p>

            <div className="flex items-center justify-between">
              <div
                className="flex h-[50px] flex-[2_2_0%] cursor-pointer items-center justify-between border-b border-l border-t border-swapBox bg-btn-black px-3"
                onClick={() => setShowModal(true)}
              >
                <p className="flex items-center gap-3">
                  <Image src={Logo} alt="token image" width={24} />
                  <span>MONI</span>
                </p>

                <ChevronDown />
              </div>

              <div className="flex h-[50px] flex-[3_3_0%] items-center justify-between border border-swapBox bg-btn-black p-3">
                <Input
                  placeholder="0.0"
                  classNames={{
                    input: 'text-right outline-none bg-transparent !text-white',
                    inputWrapper:
                      'bg-transparent group-data-[focus=true]:bg-transparent group-data-[hover=true]:bg-transparent h-full min-h-0',
                  }}
                />
              </div>
            </div>
            <p className="text-right text-swapBox">$23.45</p>
          </div>

          <div className="relative">
            <div className="absolute left-[50%] top-[50%] flex size-[40px] translate-x-[-50%] translate-y-[-50%] cursor-pointer items-center justify-center rounded-2xl bg-[#47473F]">
              <Image src={SwapIcon} alt="swap icon" />
            </div>
            <Divider className="my-4 bg-[#494646]" />
          </div>

          <div className="flex flex-col gap-3 text-sm sm:text-base">
            <p className="flex justify-between">
              <span>For</span>
              <span className="text-swapBox">Available 0.0 BERA</span>
            </p>

            <div className="flex items-center justify-between">
              <div
                className="flex h-[50px] flex-[2_2_0%] cursor-pointer items-center justify-between border-b border-l border-t border-swapBox bg-btn-black px-3"
                onClick={() => setShowModal(true)}
              >
                <p className="flex items-center gap-3">
                  <Image src={BeraLogo} alt="token image" width={24} />
                  <span>BERA</span>
                </p>

                <ChevronDown />
              </div>

              <div className="flex h-[50px] flex-[3_3_0%] items-center justify-between border border-swapBox bg-btn-black p-3">
                <Input
                  placeholder="0.0"
                  classNames={{
                    input: 'text-right outline-none bg-transparent !text-white',
                    inputWrapper:
                      'bg-transparent group-data-[focus=true]:bg-transparent group-data-[hover=true]:bg-transparent h-full min-h-0',
                  }}
                />
              </div>
            </div>
            <p className="text-right text-swapBox">$23.45</p>
          </div>
        </div>

        <div>
          {isConnected ? (
            <>
              <Button variant="primary" size="full">
                Swap
              </Button>
            </>
          ) : (
            <ConnectButton className="w-full" />
          )}
        </div>

        {isConnected && (
          <div className="flex flex-col gap-5 bg-footer p-8 text-xs sm:text-base">
            <div className="flex items-center justify-between">
              <p className="text-swapBox">
                Exchange rate found...{' '}
                <span className="cursor-pointer underline">Refresh</span>
              </p>
              <p className="flex flex-col gap-2 text-textgray sm:flex-row">
                <span className="flex gap-2">
                  1 MONI <ArrowRightLeft />
                </span>{' '}
                <span>0.05188 BERA</span>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-swapBox">
                Slippage applied...{' '}
                <span className="cursor-pointer underline">Adjust</span>
              </p>
              <p className="text-textgray">1.0%</p>
            </div>

            <p className="flex items-center justify-between">
              <span className="text-swapBox">Minimum received</span>
              <span className="text-textgray">0.28988 BERA</span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-swapBox">Price impact</span>
              <span className="text-green1">0.09671%</span>
            </p>
          </div>
        )}
      </div>

      <TokenSelectModal isOpen={showModal} close={() => setShowModal(false)} />
    </div>
  );
}
