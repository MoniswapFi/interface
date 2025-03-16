"use client";
import BackgroundLoader from "@/components/Home/BackgroundLoader";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

// Define an interface for the hexagon coordinates
interface HexagonCoordinates {
  x: number;
  y: number;
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  // Properly type the state to allow for null value
  const [hexagonCoordinates, setHexagonCoordinates] =
    useState<HexagonCoordinates | null>(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-900">
      {isLoaded && <BackgroundLoader />}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 100 }}
      >
        {/* Red box at the exact coordinates */}
        {hexagonCoordinates && (
          <div
            className="absolute"
            style={{
              left: `${hexagonCoordinates.x}px`,
              top: `${hexagonCoordinates.y}px`,
              width: "20px",
              height: "20px",
              backgroundColor: "red",
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black opacity-80"
        style={{ zIndex: 0 }}
      />
      <Head>
        <title>World Map Visualization</title>
        <meta
          name="description"
          content="Interactive world map visualization"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className="relative flex min-h-[calc(100vh-48px)] flex-col items-center justify-center px-4 pb-20 text-white sm:px-8 sm:pb-24 md:px-16 md:pb-36 lg:px-24"
        style={{ zIndex: 10 }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
            THE ESSENTIAL TRADING & LIQUIDITY MARKETPLACE ON BERACHAIN
          </h1>
        </div>
        <div className="flex max-w-6xl justify-center gap-12">
          <button className="bg-white px-12 py-6 text-black md:w-72 md:px-0">
            START TRADING
          </button>
          <button className="bg-[#F59855] py-6 text-white sm:px-12 md:w-72 md:px-0">
            WHAT IS MONISWAP?
          </button>
        </div>
      </main>
    </div>
  );
}
