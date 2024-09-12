"use client";

import Link from "next/link";

export const Footer = () => {
    const today = new Date().getFullYear();
    return (
        <div className="bg-footer px-10 py-5">
            <div className="flex items-end justify-between pb-[35px] md:items-start md:pb-[55px]">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
                    <Link href={"#"}>Documentation</Link>
                    <Link href={"#"}>Security</Link>
                    <Link href={"#"}>Brand Kit</Link>
                    <Link href={"#"}>Tokens</Link>
                </div>
                <div className="bg-btn-primary px-5 py-3">Mirror &lt;</div>
            </div>

            <div className="max-md:space-y-10max-md:pb-5 justify-between md:flex">
                <div className="flex flex-col md:flex-row">
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
