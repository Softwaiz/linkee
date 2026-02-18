"use client";
import { useDimensions } from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { HTMLAttributes, PropsWithChildren, useRef } from "react";

export default function PageTitle({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
    return <h1
        {...props}
        className={
            cn(
                "text-base lg:text-lg text-nowrap truncate",
                "page-title",
                className
            )
        }>
        {children}
    </h1>
}