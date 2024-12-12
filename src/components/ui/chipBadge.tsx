"use client";

import { PropsWithChildren } from "react";

export const ChipBadge = ({ children }: PropsWithChildren) => {
  return (
    <p className="w-fit bg-darkgray px-2 py-1 text-xs text-lightblue">
      {children}
    </p>
  );
};
