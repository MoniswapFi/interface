import { Address } from 'viem';

export type TokenType = {
  name: string;
  address: Address;
  symbol: string;
  decimals: number;
  logoURI: string;
  chainId: number;
};
