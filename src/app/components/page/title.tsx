"use client";
import { useDimensions } from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { HTMLAttributes, PropsWithChildren, useRef } from "react";

export default function PageTitle({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const wrapperRect = useDimensions(wrapperRef);

    const contentRef = useRef<HTMLDivElement | null>(null);
    const contentRect = useDimensions(contentRef);

    return <div 
        ref={wrapperRef} 
        className="relative grow"
        style={{
            height: `${contentRect.dimensions?.height ?? 10}px`
        }}>
        <h1
            {...props}
            ref={contentRef}
            style={{
                ...props.style,
                width: `${wrapperRect.dimensions?.width ?? 10}px`
            }}
            className={
                cn(
                    "absolute top-0 left-0",
                    "text-base lg:text-lg truncate",
                    "page-title",
                    className
                )
            }>
            {children}
        </h1>
    </div>
}

/*
    */
