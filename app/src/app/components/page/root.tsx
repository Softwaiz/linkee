import { cn } from "@/lib/utils";
import { HTMLAttributes, PropsWithChildren } from "react";

export default function PageRoot(props: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
    return <div
        className={cn(
            "w-full page",
            props.className
        )}
    >
        {props.children}
    </div>
}