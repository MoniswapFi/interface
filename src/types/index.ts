export type TokenType = {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    chainId: number;
};

export type NFTMetadata = {
    name: string;
    background_color: string;
    description: string;
    image_data: string;
    attributes: {
        trait_type: string;
        value: number | string;
        display_type?: string;
    }[];
};
