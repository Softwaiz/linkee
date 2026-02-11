import { Key, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export function Portal({ container, children, key }: PropsWithChildren<{ container: HTMLElement, key?: Key }>) {
    return createPortal(children, container, key);
}