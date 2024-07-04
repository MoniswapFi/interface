import BEAR1 from '@/assets/images/Bear1.png';
import BeraLogo from '@/assets/images/Bera.png';
import Logo from '@/assets/images/logo.svg';
import SwapIcon from '@/assets/images/swapIcon.svg';
import { Button } from '@/components/ui/button';
import { Divider, Input } from '@nextui-org/react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
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
          <div className="flex flex-col gap-3">
            <p className="flex justify-between">
              <span>Swap</span>
              <span>Available 0.0 MONI</span>
            </p>

            <div className="flex items-center justify-between">
              <div className="flex h-[50px] flex-[2_2_0%] items-center justify-between border-b border-l border-t border-swapBox bg-btn-black px-3">
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
          </div>

          <div className="relative">
            <div className="absolute left-[50%] top-[50%] flex size-[40px] translate-x-[-50%] translate-y-[-50%] cursor-pointer items-center justify-center rounded-2xl bg-[#47473F]">
              <Image src={SwapIcon} alt="swap icon" />
            </div>
            <Divider className="my-4 bg-[#494646]" />
          </div>

          <div className="flex flex-col gap-3">
            <p className="flex justify-between">
              <span>For</span>
              <span>Available 0.0 BERA</span>
            </p>

            <div className="flex items-center justify-between">
              <div className="flex h-[50px] flex-[2_2_0%] items-center justify-between border-b border-l border-t border-swapBox bg-btn-black px-3">
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
          </div>
        </div>

        <div>
          <Button variant="primary" size="full">
            Connect Wallet
          </Button>
        </div>
      </div>
    </div>
  );
}
