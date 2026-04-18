import { getMyReactions } from "@/actions/collections/reactions";
import { useCallback, useEffect, useState } from "react";

export function useMyReactions(collectionId: string) {
    const [isLoading, setIsLoading] = useState(true);
    const [myReactions, setMyReactions] = useState<Awaited<ReturnType<typeof getMyReactions>>>(undefined);

    const refresh = useCallback(() => {
        setIsLoading(true);
        getMyReactions(collectionId)
            .then((reactions) => {
                if (reactions) {
                    setMyReactions(reactions);
                }
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [collectionId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return {
        ...myReactions,
        isLoading,
        refresh
    }
}