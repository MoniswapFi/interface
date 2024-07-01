'use client';

import Link from 'next/link';

export const Footer = () => {
  const today = new Date().getFullYear();
  return (
    <div className="bg-footer px-10 py-5">
      <div className="flex h-[200px] items-start justify-between">
        <div className="flex items-center gap-5">
          <Link href={'#'}>Documentation</Link>
          <Link href={'#'}>Security</Link>
          <Link href={'#'}>Brand Kit</Link>
          <Link href={'#'}>Tokens</Link>
        </div>
        <div className="bg-btn-primary px-5 py-3">Mirror &lt;</div>
      </div>

      <div className="flex justify-between">
        <div>
          <span>{today} &copy; Moniswap</span>
          <span>Terms of Service</span>
        </div>

        <div>
          <span>A public good for 🐻⛓️ Berachain</span>
        </div>
      </div>
    </div>
  );
};
