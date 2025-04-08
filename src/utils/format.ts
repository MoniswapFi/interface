import {
  __CHAIN_IDS__,
  __ETHER__,
  __WRAPPED_ETHER__,
} from "@/config/constants";
import { Address } from "viem";

export const truncateAddress = (address: Address) => {
  return address.slice(0, 5) + "..." + address.slice(-5);
};

export const toSF = (i: any, sf: number = 3) =>
  Number(i).toLocaleString("en-US", {
    maximumFractionDigits: sf,
    useGrouping: true,
  });

export const num = (value: any) => Number(value ?? 0);

export const formatNumber = (value?: any, opts?: Intl.NumberFormatOptions) => {
  const min = 1 / 10 ** (opts?.maximumFractionDigits ?? 3);
  const n = num(value);
  if (n !== 0 && n < min) {
    return "< " + new Intl.NumberFormat("en-US", opts).format(min);
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    ...opts,
  }).format(n);
};

export const treatETHAsWETHIfApplicable = (
  address: Address,
  chainId: number = __CHAIN_IDS__.bera_bepolia,
) => {
  const weth = __WRAPPED_ETHER__[chainId];
  return address.toLowerCase() === __ETHER__.toLowerCase()
    ? (weth as Address)
    : address;
};

export const treatWETHAsETHIfApplicable = (address: Address, chainId: number = __CHAIN_IDS__.bera_bepolia) => {
  const weth = __WRAPPED_ETHER__[chainId];
  return address.toLowerCase() === weth.toLowerCase() ? __ETHER__ : address;
}
