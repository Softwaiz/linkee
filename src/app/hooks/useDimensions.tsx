import { RefObject, useEffect, useState } from "react";

export function useDimensions<D extends HTMLElement>(ref: RefObject<D | null>) {
    const [rect, setRect] = useState<DOMRect>();

    useEffect(() => {
        if (ref.current) {

            const observer = new IntersectionObserver(([entry]) => {
                console.log("entry changed");
                setRect(entry.target.getBoundingClientRect());
            });

            const resizeListener = (ev: UIEvent) => {
                setRect(ref.current?.getBoundingClientRect());
            }

            setRect(ref.current.getBoundingClientRect());
            observer.observe(ref.current);
            window.addEventListener("resize", resizeListener);

            return () => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                    window.removeEventListener("resize", resizeListener);
                }
            }
        }
    }, []);

    return {
        dimensions: rect
    }
}