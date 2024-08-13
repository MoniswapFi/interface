/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'artio-static-asset-public.s3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'tokens.pancakeswap.finance',
      },
      {
        protocol: 'https',
        hostname: 'imgproxy-testnet.avascan.com',
      },
    ],
  },
};

export default nextConfig;
