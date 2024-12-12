"use client";

import Coinbase from "@/assets/images/coinbase.svg";
import Metamask from "@/assets/images/metamask.svg";
import WalletConnect from "@/assets/images/walletconnect.svg";
import { useCreateWallet } from "@/hooks/api/wallet";
import { truncateAddress } from "@/utils/format";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Settings } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Address, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import { DisconnectModal } from "../DisconnectModal/DisconnectModal";
import { SettingsModal } from "../Modal";
import { Button } from "../ui/button";

type Props = {
  className?: string;
};

export const ConnectButton: FC<Props> = ({ className }) => {
  const searchParams = useSearchParams();

  const { isOpen, onOpenChange } = useDisclosure();
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const { mutateAsync: createWallet } = useCreateWallet();

  const runWalletCreation = async () => {
    if (address) {
      const referral = searchParams.get("referral");
      createWallet({
        address: address as Address,
        referral: referral ?? "",
      });
    }
  };

  useEffect(() => {
    runWalletCreation();
  }, [address]);

  return (
    <>
      {isConnected ? (
        <div className="flex cursor-pointer items-center gap-2 border border-[#F59855] bg-btn-black px-3 py-3 transition hover:bg-[#F59855]/50 hover:ease-in-out md:pl-12 md:pr-12">
          <span onClick={() => setShowDisconnectModal(true)}>
            {truncateAddress(address ?? zeroAddress)}
          </span>
          <span onClick={() => setShowSettingModal(true)}>
            <Settings />
          </span>
        </div>
      ) : (
        <Button
          variant="primary"
          onClick={openConnectModal}
          className={className}
        >
          Connect
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          base: "bg-footer",
        }}
        backdrop="blur"
        placement="center"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 pt-10 text-4xl uppercase text-yellow1">
                connect wallet
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-5 py-5 uppercase">
                  <div className="flex cursor-pointer items-center bg-brightBlack py-5">
                    <div className="flex w-[70px] justify-center">
                      <Image src={Metamask} alt="metamask" />
                    </div>
                    <p>Connect with Metamask</p>
                  </div>

                  <div className="flex cursor-pointer items-center bg-brightBlack py-5">
                    <div className="flex w-[70px] justify-center">
                      <Image src={WalletConnect} alt="walletconnect" />
                    </div>
                    <p>Connect with Walletconnect</p>
                  </div>

                  <div className="flex cursor-pointer items-center bg-brightBlack py-5">
                    <div className="flex w-[70px] justify-center">
                      <Image src={Coinbase} alt="coinbase" />
                    </div>
                    <p>Connect with Coinbase</p>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <SettingsModal
        isOpen={showSettingModal}
        close={() => setShowSettingModal(false)}
      />

      <DisconnectModal
        isOpen={showDisconnectModal}
        close={() => setShowDisconnectModal(false)}
      />
    </>
  );
};
