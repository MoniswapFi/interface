import {
    DEFAULT_TITLE,
    LOCK_DESCRIPTION,
    LOCK_TITLE,
    TITLE_BREAKER,
} from "@/components/configuration/seo";
import * as React from "react";

export const metadata = {
    title: `${LOCK_TITLE} ${TITLE_BREAKER} ${DEFAULT_TITLE}`,
    description: `${LOCK_DESCRIPTION}`,
};

export default function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
