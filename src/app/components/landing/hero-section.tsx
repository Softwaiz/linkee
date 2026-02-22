import { Search } from "lucide-react"

const popularChips = ["Web dev", "Finance", "Productivity", "Design tools"]

export function HeroSection() {
    return (
        <header className="flex flex-col items-center px-6 pb-16 pt-20 md:pb-24 md:pt-28">
            <div className="mx-auto max-w-[680px] text-center">
                <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-[56px] md:leading-[1.1]">
                    Collect. Organize.
                    <br />
                    Share what matters.
                </h1>

                <p className="font-body mx-auto mt-5 max-w-[520px] text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                    Build curated collections of links, videos, tools and resources.
                    Explore what others have already discovered.
                </p>

                {/* Search bar */}
                <div className="relative mx-auto mt-10 max-w-[540px]">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <input
                        type="search"
                        placeholder="Search collections, creators, tools..."
                        className="h-12 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-sm text-foreground shadow-sm transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 md:h-14 md:text-base"
                        aria-label="Search collections, creators, tools"
                    />
                </div>

                {/* Popular search chips */}
                <div className="mx-auto mt-5 flex max-w-[540px] flex-wrap items-center justify-center gap-2">
                    <span className="text-xs text-muted-foreground">Popular:</span>
                    {popularChips.map((chip) => (
                        <button
                            key={chip}
                            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    )
}
