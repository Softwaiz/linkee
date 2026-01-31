import { cn } from "@/lib/utils";
import { HTMLAttributes, PropsWithChildren } from "react";

export default function PageTitle({ className, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
    return <h1
        {...props}
        className={
            cn(" text-base lg:text-lg max-w-[10ch] md:max-w-[30ch] lg:max-w-[40ch] truncate","page-title", className)
        }>
        {props.children}
    </h1>
}