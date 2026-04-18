"use client"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "../link"
import { TrendingItem } from "./trending-section"

interface TrendingSectionProps {
    items: TrendingItem[]
}

export function TrendingSection({ items }: TrendingSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return
        const amount = 280
        scrollRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        })
    }

    return (
        <section className="px-6 py-16 md:py-20" aria-labelledby="trending-heading">
            <div className="mx-auto max-w-[1080px]">
                <div className="flex items-center justify-between">
                    <h2
                        id="trending-heading"
                        className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
                    >
                        Trending Today
                    </h2>
                    <div className="hidden gap-2 md:flex">
                        <button
                            onClick={() => scroll("left")}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2 scrollbar-none"
                    style={{ scrollbarWidth: "none" }}
                >
                    {items.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="flex min-w-[240px] snap-start flex-col rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <span className="mt-2 text-sm font-semibold text-foreground">
                                {item.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
