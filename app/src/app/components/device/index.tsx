"use client";

import { Activity, PropsWithChildren } from "react";
import { useMedia } from "./useMedia"

function Device({ query, defaultMatch = false, children }: PropsWithChildren<{ query: string, defaultMatch?: boolean; }>) {
    const matches = useMedia(query, defaultMatch);
    return <Activity mode={matches.match ? "visible" : "hidden"} >
        {children}
    </Activity>
}

function Exact({ size, defaultMatch = false, children }: PropsWithChildren<{ size: string, defaultMatch?: boolean; }>) {
    return <Device query={`(width: ${size})`} defaultMatch={defaultMatch}>
        {children}
    </Device>
}

function MaxWidth({ width, defaultMatch = false, children }: PropsWithChildren<{ width: string, defaultMatch?: boolean; }>) {
    return <Device query={`(max-width: ${width})`} defaultMatch={defaultMatch}>
        {children}
    </Device>
}

function MinWidth({ width, defaultMatch = false, children }: PropsWithChildren<{ width: string, defaultMatch?: boolean; }>) {
    return <Device query={`(min-width: ${width})`} defaultMatch={defaultMatch}>
        {children}
    </Device>
}

function Between({ minWidth, maxWidth, defaultMatch = false, children }: PropsWithChildren<{ minWidth: string, maxWidth: string, defaultMatch?: boolean; }>) {
    return <Device query={`(min-width: ${minWidth}) and (max-width: ${maxWidth})`} defaultMatch={defaultMatch}>
        {children}
    </Device>
}


enum Size {
    sm = "40rem",
    md = "48rem",
    lg = "64rem",
    xl = "80rem",
    xxl = "96rem"
}


function Small({ defaultMatch = false, children }: PropsWithChildren<{ defaultMatch?: boolean; }>) {
    return <MaxWidth width="40rem" defaultMatch={defaultMatch}>{children}</MaxWidth>
}

function Medium({ defaultMatch = false, children }: PropsWithChildren<{ defaultMatch?: boolean; }>) {
    return <MaxWidth width="48rem" defaultMatch={defaultMatch}>{children}</MaxWidth>
}

function Large({ defaultMatch = false, children }: PropsWithChildren<{ defaultMatch?: boolean; }>) {
    return <MinWidth width="64rem" defaultMatch={defaultMatch}>{children}</MinWidth>
}

function Larger({ defaultMatch = false, children }: PropsWithChildren<{ defaultMatch?: boolean; }>) {
    return <MinWidth width="80rem" defaultMatch={defaultMatch}>{children}</MinWidth>
}

function ExtraLarge({ defaultMatch = false, children }: PropsWithChildren<{ defaultMatch?: boolean; }>) {
    return <MinWidth width="96rem" defaultMatch={defaultMatch}>{children}</MinWidth>
}

export default { Custom: Device, Exact, Between, MaxWidth, MinWidth, Small, Medium, Large, Larger, ExtraLarge }