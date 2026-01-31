"use client";
import { useEffect, useState } from "react";

export function useMedia(query: string, defaultValue: boolean = false) {
    const [value, setValue] = useState(defaultValue);
    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const onMediaChange = (ev: MediaQueryListEvent) => {
            setValue(ev.matches);
        }
        setValue(mediaQuery.matches);
        mediaQuery.addEventListener("change", onMediaChange);
        return () => {
            mediaQuery.removeEventListener("change", onMediaChange);
        }
    }, [query]);
    return { match: value };
}