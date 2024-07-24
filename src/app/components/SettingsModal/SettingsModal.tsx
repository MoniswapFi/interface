import {
  cn,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import { FC, useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  close: () => void;
};

export const SettingsModal: FC<ModalProps> = ({ isOpen, close }) => {
  const [txDeadline, setTxDeadline] = useState(1);
  const [slippage, setSlippage] = useState('0.5');

  const confirmChange = () => {
    // TODO: init store and save changes
    close();
  };

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
            <ModalHeader className="flex flex-col gap-1 pt-10 text-4xl uppercase text-yellow1">
              Connect Wallet
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-10 pb-5">
                <div className="space-y-7">
                  <div>Slippage Tolerance</div>

                  <div className="grid grid-cols-4 text-textgray">
                    <div
                      className={cn(
                        'flex cursor-pointer items-center justify-center bg-brightBlack py-7 hover:border hover:border-btn-primary/40',
                        {
                          'border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white':
                            slippage === '0.1',
                        },
                      )}
                      onClick={() => setSlippage('0.1')}
                    >
                      0.1%
                    </div>
                    <div
                      className={cn(
                        'flex cursor-pointer items-center justify-center bg-brightBlack py-7 hover:border hover:border-btn-primary/40',
                        {
                          'border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white':
                            slippage === '0.5',
                        },
                      )}
                      onClick={() => setSlippage('0.5')}
                    >
                      0.5%
                    </div>
                    <div
                      className={cn(
                        'flex cursor-pointer items-center justify-center bg-brightBlack py-7 hover:border hover:border-btn-primary/40',
                        {
                          'border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white':
                            slippage === '1',
                        },
                      )}
                      onClick={() => setSlippage('1')}
                    >
                      1%
                    </div>
                    <div
                      className={cn(
                        'flex cursor-pointer items-center justify-center bg-brightBlack py-7',
                        {
                          'border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white':
                            slippage !== '0.1' &&
                            slippage !== '0.5' &&
                            slippage !== '1',
                        },
                      )}
                    >
                      <Input
                        classNames={{
                          base: 'bg-transparent',
                          inputWrapper:
                            'bg-transparent group-data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent',
                          input: 'text-center !text-white',
                        }}
                        value={slippage.toString()}
                        onValueChange={(val) => setSlippage(val)}
                      />
                    </div>
                  </div>
                </div>
                <p className=""></p>

                <div className="space-y-7">
                  <div>Transaction Deadline</div>

                  <div className="grid grid-cols-4 text-textgray">
                    <div
                      className={cn(
                        'flex cursor-pointer justify-center bg-brightBlack py-7 hover:border hover:border-btn-primary/40',
                        {
                          'border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white':
                            txDeadline === 1,
                        },
                      )}
                      onClick={() => setTxDeadline(1)}
                    >
                      1 MIN
                    </div>
                    <div
                      className={cn(
                        'flex cursor-pointer justify-center bg-brightBlack py-7 hover:border hover:border-btn-primary/40',
                        {
                          'border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white':
                            txDeadline === 5,
                        },
                      )}
                      onClick={() => setTxDeadline(5)}
                    >
                      5 MIN
                    </div>
                    <div
                      className={cn(
                        'flex cursor-pointer justify-center bg-brightBlack py-7 hover:border hover:border-btn-primary/40',
                        {
                          'border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white':
                            txDeadline === 10,
                        },
                      )}
                      onClick={() => setTxDeadline(10)}
                    >
                      10 MIN
                    </div>
                    <div
                      className={cn(
                        'flex cursor-pointer justify-center bg-brightBlack py-7 hover:border hover:border-btn-primary/40',
                        {
                          'border border-btn-primary bg-gradient-to-b from-btn-primary/10 to-arrow-yellow/10 text-white':
                            txDeadline === 30,
                        },
                      )}
                      onClick={() => setTxDeadline(30)}
                    >
                      30 MIN
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div
                    className="flex cursor-pointer justify-center bg-brightBlack py-10 uppercase text-textgray"
                    onClick={close}
                  >
                    Cancel
                  </div>
                  <div
                    className="flex cursor-pointer justify-center bg-btn-primary py-10 uppercase"
                    onClick={confirmChange}
                  >
                    Confirm
                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
