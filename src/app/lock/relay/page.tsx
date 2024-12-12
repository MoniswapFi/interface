"use client";

import BEAR1 from "@/assets/images/Bear1.png";
import Vector from "@/assets/images/Vector.svg";
import { Button } from "@/components/ui/button";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Divider, Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [amount, setAmount] = useState(0.0);

  return (
    <div className="p-5 pb-20">
      <Image
        src={BEAR1}
        alt="bear"
        className="absolute left-[50%] top-0 translate-x-[-50%]"
        width={350}
      />

      <div className="z-1 relative m-auto mt-32 flex max-w-[620px] flex-col gap-10">
        <div className="bg-footer p-5 md:p-8">
          <div className="flex flex-col gap-7 text-sm sm:text-base">
            <div className="flex flex-col gap-5">
              <div className="space-y-1">
                <p>Select the Lock you want to deposit</p>
              </div>
            </div>

            <Select
              label="Select the lock"
              classNames={{
                trigger:
                  "bg-transparent data-[hover=true]:bg-transparent border border-swapBox",
                listbox: "bg-footer",
                listboxWrapper: "bg-footer",
                popoverContent:
                  "p-0 bg-footer border rounded-none border-swapBox",
                label: "hidden",
                base: "!m-0",
                value: "!text-white",
              }}
              radius="none"
              labelPlacement="outside"
            >
              {Array.from({ length: 10 }).map((item, index) => {
                return (
                  <SelectItem
                    key={index}
                    className="data-[hover=true]:border data-[hover=true]:border-swapBox data-[hover=true]:bg-transparent data-[hover=true]:text-white"
                  >
                    Lock {index}
                  </SelectItem>
                );
              })}
            </Select>

            <div className="flex gap-2 text-navDefault">
              <div className="mt-1 flex h-[15px] w-[15px] min-w-0 flex-shrink-0 items-center justify-center rounded-full border border-navDefault">
                <FontAwesomeIcon icon={faInfo} className="w-[3px]" />
              </div>
              <div>
                Understand that by depositing your Lock into a Relay strategy,
                the Lock unlock date will be extended to 4 years.
              </div>
            </div>

            <Divider className="bg-swapBox" />

            <p className="text-lg">Relay Strategy </p>
            <div className="flex items-center gap-3">
              <div className="w-fit bg-black p-5">
                <Image alt="vector" src={Vector} />
              </div>
              <div className="flex flex-col gap-1">
                <p>veMONI Maxi</p>
                <p className="text-btn-primary underline">
                  Updated a day ago · 0xc981...EF14f
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="primary" className="w-full">
          Deposit
        </Button>
      </div>
    </div>
  );
}
