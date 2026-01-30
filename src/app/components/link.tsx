"use client";
import { AnchorHTMLAttributes, HTMLAttributes, startTransition } from "react";
import { navigate, NavigateOptions } from "rwsdk/client";

export function Link({ children, href, target, history, info, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & Partial<NavigateOptions>) {
    return <a
        {...props}
        href={href}
        onClick={(ev) => {
            if (href && (!target || target !== "_blank")) {
                ev.preventDefault();
                document.startViewTransition(() => {
                    navigate(href, { history, info });
                });
            }
        }}
    >
        {children}
    </a>
}