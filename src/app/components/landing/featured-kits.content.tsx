import { ExternalLink } from "lucide-react"
import { Link } from "../link"

interface Kit {
    title: string
    linkCount: number
    category: string
    color: string
}

const featuredKits: Kit[] = [
    {
        title: "Resources for your next web project",
        linkCount: 12,
        category: "Web Dev",
        color: "bg-blue-50 text-blue-600",
    },
    {
        title: "Sourcing \u2013 Best suppliers for products",
        linkCount: 8,
        category: "Business",
        color: "bg-amber-50 text-amber-600",
    },
    {
        title: "AI Resources & Tools",
        linkCount: 14,
        category: "AI",
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        title: "Youtube Channels to Level Up",
        linkCount: 20,
        category: "Learning",
        color: "bg-rose-50 text-rose-600",
    },
    {
        title: "Travel Vlogs Collection",
        linkCount: 4,
        category: "Travel",
        color: "bg-sky-50 text-sky-600",
    },
    {
        title: "Lo-Fi Music for Deep Focus",
        linkCount: 6,
        category: "Music",
        color: "bg-violet-50 text-violet-600",
    },
]

export function FeaturedKitsContent() {
    return (
        <section id="kits" className="px-6 py-16 md:py-20" aria-labelledby="featured-kits-heading">
            <div className="mx-auto max-w-[1080px]">
                <h2
                    id="featured-kits-heading"
                    className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
                >
                    Popular Kits
                </h2>
                <p className="mx-auto mt-3 max-w-md text-center text-sm text-muted-foreground md:text-base">
                    Discover what others have curated
                </p>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredKits.map((kit) => (
                        <Link
                            key={kit.title}
                            href="#"
                            className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                            {/* Category badge */}
                            <span
                                className={`inline-flex w-fit rounded-md px-2.5 py-1 text-xs font-medium ${kit.color}`}
                            >
                                {kit.category}
                            </span>

                            {/* Title */}
                            <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground group-hover:text-foreground/80">
                                {kit.title}
                            </h3>

                            {/* Meta */}
                            <div className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-muted-foreground">
                                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>
                                    {kit.linkCount} link{kit.linkCount !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
