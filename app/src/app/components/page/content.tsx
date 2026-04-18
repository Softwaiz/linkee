import { cn } from "@/lib/utils";
import { HTMLAttributes, PropsWithChildren } from "react";

export default function PageContent({ container = false, className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement> & { container?: boolean; }>) {
    return <div
        {...props}
        className={cn(
            container && "container mx-auto",
            "py-4",
            className
        )}>
        {children}
    </div>
}