import {
    DEFAULT_TITLE,
    TITLE_BREAKER,
    VOTE_DESCRIPTION,
    VOTE_TITLE,
} from "@/config/seo";
import * as React from "react";

export const metadata = {
    title: `${VOTE_TITLE} ${TITLE_BREAKER} ${DEFAULT_TITLE}`,
    description: `${VOTE_DESCRIPTION}`,
};

export default function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
