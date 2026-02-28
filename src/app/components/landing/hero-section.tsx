
export function HeroSection() {
    return (
        <header className="flex flex-col items-center">
            <div className="mx-auto container text-center py-16">
                <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-[56px] md:leading-[1.1]">
                    Collect. Organize.
                    <br />
                    Share what matters.
                </h1>
                <p className="font-body mx-auto max-w-[520px] text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                    Build curated collections of links, videos, tools and resources.
                    Explore what others have already discovered.
                </p>
            </div>
        </header>
    )
}
