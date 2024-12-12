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
