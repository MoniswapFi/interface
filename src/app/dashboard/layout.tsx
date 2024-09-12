import {
    DASHBOARD_DESCRIPTION,
    DASHBOARD_TITLE,
    DEFAULT_TITLE,
    TITLE_BREAKER,
} from "@/components/configuration/seo";
import * as React from "react";

export const metadata = {
    title: `${DASHBOARD_TITLE} ${TITLE_BREAKER} ${DEFAULT_TITLE}`,
    description: `${DASHBOARD_DESCRIPTION}`,
};

export default function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
