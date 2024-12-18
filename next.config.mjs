import pwa from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

const withPWA = pwa({
  dest: "public",
  skipWaiting: true,
  disable: process.env.NODE_ENV !== "production",
  register: true,
  runtimeCaching,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default withPWA(nextConfig);
