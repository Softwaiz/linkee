"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollLocker() {
    const [locked, setLocked] = useState(false);
    const overflowX = useRef<string | undefined>(undefined);
    const overflowY = useRef<string | undefined>(undefined);

    useEffect(() => {
        const style = window.getComputedStyle(document.body);
        overflowX.current = style.overflowX;
        overflowY.current = style.overflowY;
    }, []);

    const lock = useCallback(() => {
        const style = window.getComputedStyle(document.body);
        overflowX.current = style.overflowX;
        overflowY.current = style.overflowY;
        document.body.style.overflowX = "hidden";
        document.body.style.overflowY = "hidden";
        setLocked(true);
    }, []);

    const unlock = useCallback(() => {
        if (overflowX.current) {
            document.body.style.overflowX = overflowX.current;
            overflowX.current = undefined;
        }
        if (overflowY.current) {
            document.body.style.overflowY = overflowY.current;
            overflowY.current = undefined;
        }
        setLocked(false);
    }, []);

    return { locked, lock, unlock };
}


export function useScrollLockerEffect(locked: boolean) {
    const locker = useScrollLocker();

    useEffect(() => {
        if (locked) locker.lock();
        else locker.unlock();

        return () => {
            locker.unlock();
        }
    }, [locked]);

    return locker;
}