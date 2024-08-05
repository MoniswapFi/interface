import BeraLogo from '@/assets/images/Bera.png';
import { TOKENS } from '@/config/tokens';
import {
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import Image from 'next/image';
import { FC } from 'react';

type ModalProps = {
  isOpen: boolean;
  close: () => void;
};

export const TokenSelectModal: FC<ModalProps> = ({ isOpen, close }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={close}
      classNames={{
        base: 'bg-footer',
      }}
      backdrop="blur"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 pt-10 text-3xl text-yellow1">
              Select a Token
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-5">
                <Input placeholder="Search by name, symbol or address" />

                <div className="grid grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 bg-brightBlack px-2 py-3">
                    <Image src={BeraLogo} alt="token logo" />
                    <span className="text-xl">BERA</span>
                  </div>
                  <div className="flex items-center gap-2 bg-brightBlack px-2 py-3">
                    <Image src={BeraLogo} alt="token logo" />
                    <span className="text-xl">BERA</span>
                  </div>
                  <div className="flex items-center gap-2 bg-brightBlack px-2 py-3">
                    <Image src={BeraLogo} alt="token logo" />
                    <span className="text-xl">BERA</span>
                  </div>
                  <div className="flex items-center gap-2 bg-brightBlack px-2 py-3">
                    <Image src={BeraLogo} alt="token logo" />
                    <span className="text-xl">BERA</span>
                  </div>
                </div>

                <Divider className="bg-swapBox" />

                <div className="max-h-[300px] overflow-y-auto">
                  {TOKENS.map((item, index) => {
                    return (
                      <div
                        className="flex cursor-pointer items-center justify-between px-2 py-2 hover:bg-brightBlack"
                        key={index}
                      >
                        <div className="flex items-center gap-2">
                          <Image src={BeraLogo} alt="token logo" />
                          <span className="text-xl">{item.name}</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xl">345.78</span>
                          <span className="text-textlightgray">$254.89</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
