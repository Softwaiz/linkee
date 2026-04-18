import { useCallback, useEffect, useRef, useState } from "react";

export function usePasswordVisibility() {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [visible]);

    const show = useCallback(() => {
        setVisible(true);
        setTimeout(() => {
            setVisible(false);
        }, 5000);
    }, []);

    return {
        visible,
        show
    }
}