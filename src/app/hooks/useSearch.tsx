import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "./useDebounce";
import { appbarSearch } from "@/actions/collections/search";

export function useSearch(initialQuery: string) {
    const [query, setQuery] = useState(initialQuery);
    const [searching, setSearching] = useState(false);
    const [searchCount, setSearchCount] = useState(0);
    const [searchResults, setSearchResult] = useState<{ id: string, slug: string | null, label: string, description: string, createdAt: string, updatedAt: string }[]>([]);
    const searchDebouncer = useDebounce(500);

    useEffect(() => {
        searchDebouncer.delay(async () => {
            if (query.length === 0) {
                setSearchCount(0);
                setSearchResult([]);
                setSearching(false);
                return;
            }
            setSearching(true);
            appbarSearch(query)
                .then((result) => {
                    setSearchCount(result.count);
                    setSearchResult(result.items);
                })
                .finally(() => {
                    setSearching(false);
                })
        })
        return () => {
            searchDebouncer.cancel();
        }
    }, [query])

    return {
        query,
        setQuery: setQuery,
        isLoading: searching,
        count: searchCount,
        items: searchResults
    }
}