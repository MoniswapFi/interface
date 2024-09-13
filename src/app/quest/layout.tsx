import {
    DEFAULT_TITLE,
    QUEST_DESCRIPTION,
    QUEST_TITLE,
    TITLE_BREAKER,
} from "@/config/seo";
import * as React from "react";

export const metadata = {
    title: `${QUEST_TITLE} ${TITLE_BREAKER} ${DEFAULT_TITLE}`,
    description: `${QUEST_DESCRIPTION}`,
};

export default function ComponentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
