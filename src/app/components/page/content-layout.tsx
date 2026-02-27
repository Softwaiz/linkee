"use client";

import { PropsWithChildren, ReactNode } from "react";
import Page from ".";
import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

interface ContentHeader {
    className?: string;
    icon?: ReactNode;
    title: string | ReactNode;
    actions?: ReactNode | ReactNode[];
    middle?: ReactNode | ReactNode[];
}

interface ContentLayoutProps {
    header: ContentHeader;
}

export function ContentLayout(props: PropsWithChildren<ContentLayoutProps>) {
    const sidebar = useSidebar();

    return <Page.Root>
        <Page.Header.Custom
            className={cn("bg-card/40 justify-between px-4 sticky top-10 z-2 flex flex-row items-center gap-2 overflow-hidden @container/header", props.header.className)}>
            <div className="flex flex-row items-center justify-start gap-1 md:gap-2 overflow-hidden">
                <Button
                    className="block @xl/header:hidden"
                    variant="ghost"
                    size="icon"
                    onClick={() => sidebar.setOpenMobile(true)}>
                    <Menu />
                </Button>
                {
                    props.header.icon && <div>
                        {props.header.icon}
                    </div>
                }
                {
                    typeof props.header.title === "string" ? <Page.Title>{props.header.title}</Page.Title> : <>{props.header.title}</>
                }
            </div>
            <div className="hidden md:flex grow">
                {props.header.middle}
            </div>
            <div>
                {props.header.actions}
            </div>
        </Page.Header.Custom>
        <Page.Content container className="px-2 md:px-4">
            {props.children}
        </Page.Content>
    </Page.Root>
}