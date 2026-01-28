import { RefObject, useEffect, useState } from "react";

export function useDimensions<D extends HTMLElement>(ref: RefObject<D | null>) {
    const [rect, setRect] = useState<DOMRect>();

    useEffect(() => {
        if (ref.current) {
            console.log("observing");
            const observer = new IntersectionObserver(([entry]) => {
                console.log("entry changed");
                setRect(entry.target.getBoundingClientRect());
            });
            observer.observe(ref.current);
            return () => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            }
        }
    }, []);

    return {
        dimensions: rect
    }
}