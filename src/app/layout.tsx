import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { useMemo } from "react";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Moniswap",
  description:
    "Moniswap is a next generation AMM & liquidity aggregator on Berachain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const _headers = useMemo(() => headers(), []);
  return (
    <html lang="en">
      <body className="bg-gray-900 font-minecraft text-white">
        <Providers cookies={_headers.get("cookie")}>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-HFEN1RRYYP" />
    </html>
  );
}
