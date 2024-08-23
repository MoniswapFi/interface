import { Address } from "viem";

export const truncateAddress = (address: Address) => {
    return address.slice(0, 5) + "..." + address.slice(-5);
};

export const toSF = (i: any, sf: number = 3) =>
    Number(i).toLocaleString("en-US", {
        maximumFractionDigits: sf,
        useGrouping: true,
    });
