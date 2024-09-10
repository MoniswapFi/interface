import { GoogleAnalytics } from "@next/third-parties/google";
import "@rainbow-me/rainbowkit/styles.css";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
    return (
        <html lang="en">
            <body className="bg-black font-minecraft text-white">
                <Providers>
                    <main className="flex-1">{children}</main>
                </Providers>
            </body>
            <GoogleAnalytics gaId="G-HFEN1RRYYP" />
        </html>
    );
}
