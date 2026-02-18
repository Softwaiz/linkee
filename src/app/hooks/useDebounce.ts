import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounce(timeout: number = 3000) {
    const timerRef = useRef<NodeJS.Timeout>(null);
    const [scheduled, setScheduled] = useState(false);

    const delay = useCallback(async (func: () => void | Promise<void>) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setScheduled(true);
        timerRef.current = setTimeout(async () => {
            try {
                await func();
            } catch (error) {
                console.error(error);
            } finally {
                setScheduled(false);
            }
        }, timeout);
    }, [timeout]);

    const cancel = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            setScheduled(false);
        }
    }, []);

    return {
        delay,
        cancel,
        scheduled
    }
}