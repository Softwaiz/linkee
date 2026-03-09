import { Key, PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Portal({ container, children, key }: PropsWithChildren<{ container: HTMLElement | string, key?: Key }>) {
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (globalThis.document) {
            if (typeof container === "string") {
                let element = document.querySelector(container) as HTMLElement;
                if (element) {
                    setPortalContainer(element);
                }
            }
            else {
                setPortalContainer(container);
            }
        }
    }, []);

    if (!globalThis.document) {
        return <>{children}</>;
    }

    if (!portalContainer) {
        return <></>;
    }

    return createPortal(children, portalContainer, key);
}