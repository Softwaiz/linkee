"use client";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { Button } from "../ui/button";
import PageTitle from "./title";
import { ChevronLeft } from "lucide-react";

function Custom({ container, children, className, ...props }: PropsWithChildren<{ className?: string, container?: boolean }>) {
    return <div className="border-b">
        <div className={cn(
            "page-header",
            container ? "container mx-auto" : "px-4",
            "w-full min-h-14 flex flex-row items-center justify-start gap-2 bg-background/50 sticky z-50 top-0 left-0 backdrop-blur-lg",
            className
        )}
            {...props}>
            {children}
        </div>
    </div>
}

interface DefaultHeaderProps {
    title: string;
    hasBackAction?: boolean;
}

function Default({ title, hasBackAction = true, children }: PropsWithChildren<DefaultHeaderProps>) {
    return <Custom container className="justify-between">
        <div className="grow flex flex-row items-center justify-start gap-1">
            {
                hasBackAction && <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => {
                        window.history.back();
                    }}>
                    <ChevronLeft />
                </Button>
            }
            <PageTitle>{title}</PageTitle>
        </div>
        <div>
            {children}
        </div>
    </Custom>
}

export default { Custom, Default };