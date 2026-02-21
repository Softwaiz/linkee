"use client";
import { Loader2, Search } from "lucide-react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Portal } from "../portal";
import { useDimensions } from "@/hooks/useDimensions";
import { AnimatePresence, motion } from "motion/react";
import { SearchResults } from "./results";
import { useSearch } from "@/hooks/useSearch";

export function SearchLayout({ initialQuery, children, queryKey = "q" }: PropsWithChildren<{ queryKey?: string; initialQuery?: string }>) {
    const [searchAreaOpen, setSearchAreaOpen] = useState(false);
    const { query, setQuery, isLoading: isSearching, count: searchCount, items: searchItems } = useSearch(initialQuery ?? '');

    const inputContainerRef = useRef<HTMLDivElement>(null);
    const { dimensions: inputContainerSize } = useDimensions(inputContainerRef);

    useEffect(() => {
        const outsideClickHandler = (e: MouseEvent) => {
            if (inputContainerRef.current && !inputContainerRef.current.contains(e.target as Node)) {
                setSearchAreaOpen(false);
            }
        }
        window.addEventListener("click", outsideClickHandler);
        return () => {
            window.removeEventListener("click", outsideClickHandler);
        }
    }, []);

    const [currentStyle, setCurrentStyle] = useState<{ x: string, y: string }>(() => {
        if (globalThis.window) {
            const computedStyle = window.getComputedStyle(document.documentElement);
            return {
                x: computedStyle.getPropertyValue("overflow-x"),
                y: computedStyle.getPropertyValue("overflow-y"),
            }
        }
        return { x: 'auto', y: 'auto' }
    });

    useEffect(() => {
        if (searchAreaOpen) {
            const computedStyle = window.getComputedStyle(document.documentElement);
            const overflowX = computedStyle.getPropertyValue("overflow-x");
            const overflowY = computedStyle.getPropertyValue("overflow-y");
            document.documentElement.style.overflow = "hidden";
            setCurrentStyle({
                x: overflowX,
                y: overflowY,
            });
        } else {
            document.documentElement.style.overflow = currentStyle.x;
            document.documentElement.style.overflowY = currentStyle.y;
        }
    }, [searchAreaOpen, currentStyle.x, currentStyle.y]);

    return <div className="w-full flex flex-row items-center justify-center relative">
        <div className="relative w-full text-muted" ref={inputContainerRef}>
            <span className="h-full aspect-square flex items-center justify-center bg-background/15 rounded-full absolute left-0 top-0">
                {
                    isSearching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />
                }
            </span>
            <Input
                type="text"
                placeholder="Search collections..."
                value={query}
                onFocus={() => {
                    setSearchAreaOpen(true);
                }}
                onChange={(e) => {
                    setQuery(e.currentTarget.value)
                }}
                className="w-full h-10 rounded-full border-0 bg-muted/10 pl-12 focus:bg-background/10 placeholder:text-white/60"
            />
        </div>
        {
            globalThis.document && inputContainerSize && <Portal
                container={globalThis.document.querySelector("#root") ?? globalThis.document.body}>
                <AnimatePresence>
                    {
                        searchAreaOpen && <motion.div
                            key="search-results"
                            className="fixed top-0 z-99 max-h-96 overflow-y-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                top: `${(inputContainerSize?.top ?? 0) + (inputContainerSize?.height ?? 0) + 8}px`,
                                left: `${inputContainerSize?.left ?? 0}px`,
                                width: `${inputContainerSize?.width ?? 0}px`,
                            }}
                        >
                            <div className="container mx-auto bg-white/60 text-card-foreground backdrop-blur-lg flex flex-col gap-2 min-h-20 border border-input rounded-md p-2 lg:p-4">
                                <SearchResults
                                    isPending={isSearching}
                                    count={searchCount}
                                    items={searchItems as any}
                                    query={query}
                                />
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </Portal>
        }
    </div >
}