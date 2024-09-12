import {
    DEFAULT_TITLE,
    LIQUIDITY_DESCRIPTION,
    LIQUIDITY_TITLE,
    TITLE_BREAKER,
} from "@/components/configuration/seo";
import * as React from "react";

export const metadata = {
    title: `${LIQUIDITY_TITLE} ${TITLE_BREAKER} ${DEFAULT_TITLE}`,
    description: `${LIQUIDITY_DESCRIPTION}`,
};

export default function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
