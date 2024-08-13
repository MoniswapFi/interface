import { Address } from 'viem';

export const truncateAddress = (address: Address) => {
  return address.slice(0, 5) + '...' + address.slice(-5);
};
