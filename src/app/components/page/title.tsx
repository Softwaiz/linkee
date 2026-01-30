import { cn } from "@/lib/utils";
import { HTMLAttributes, PropsWithChildren } from "react";

export default function PageTitle({ className, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
    return <h1
        {...props}
        className={
            cn("text-lg","page-title", className)
        }>
        {props.children}
    </h1>
}