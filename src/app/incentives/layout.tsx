import {
    DEFAULT_TITLE,
    INCENTIVES_DESCRIPTION,
    INCENTIVES_TITLE,
    TITLE_BREAKER,
} from "@/components/configuration/seo";
import * as React from "react";

export const metadata = {
    title: `${INCENTIVES_TITLE} ${TITLE_BREAKER} ${DEFAULT_TITLE}`,
    description: `${INCENTIVES_DESCRIPTION}`,
};

export default function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
