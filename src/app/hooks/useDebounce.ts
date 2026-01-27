import { useCallback, useEffect, useRef } from "react";

export function useDebounce(timeout: number = 3000) {
    const timerRef = useRef<NodeJS.Timeout>(null);

    const delay = useCallback((func: () => void) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            func();
        }, timeout);
    }, [timeout]);

    return {
        delay
    }
}