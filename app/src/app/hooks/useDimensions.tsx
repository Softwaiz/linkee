import { resize } from "motion/react";
import { RefObject, useEffect, useState } from "react";

export function useDimensions<D extends HTMLElement>(ref: RefObject<D | null>) {
    const [rect, setRect] = useState<DOMRect>();

    useEffect(() => {
        if (ref.current) {

            const resizeCleanup = resize(ref.current, (el) => {
                setRect(el.getBoundingClientRect());
            });

            const resizeListener = (ev: UIEvent) => {
                setRect(ref.current?.getBoundingClientRect());
            }

            setRect(ref.current.getBoundingClientRect());
            window.addEventListener("resize", resizeListener);

            return () => {
                resizeCleanup();
                if (ref.current) {
                    window.removeEventListener("resize", resizeListener);
                }
            }
        }
    }, []);

    return {
        dimensions: rect
    }
}