import {
    DEFAULT_TITLE,
    SWAP_DESCRIPTION,
    SWAP_TITLE,
    TITLE_BREAKER,
} from "@/components/configuration/seo";
import * as React from "react";

export const metadata = {
    title: `${SWAP_TITLE} ${TITLE_BREAKER} ${DEFAULT_TITLE}`,
    description: `${SWAP_DESCRIPTION}`,
};

export default function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
