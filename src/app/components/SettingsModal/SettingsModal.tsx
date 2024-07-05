import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { FC } from 'react';

type ModalProps = {
  isOpen: boolean;
  close: () => void;
};

export const SettingsModal: FC<ModalProps> = ({ isOpen, close }) => {
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
              <div>Settings modal</div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
