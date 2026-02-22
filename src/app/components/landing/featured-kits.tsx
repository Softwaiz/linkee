import { ExternalLink } from "lucide-react"
import { Link } from "../link"
import { env } from "cloudflare:workers"
import { db } from "@db/index"
import { Group } from "@/validations/collection/create"

interface Kit {
    title: string
    linkCount: number
    category: string
    color: string
}

export async function FeaturedKits() {
    let items = await env.CONTENT_CACHE.get("featured-kits", "json") as Kit[];
    if (!items) {
        items = (await db
            .selectFrom("boards")
            .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
            .select(["boards.id", "boards.label as title", "boards.description", "boards.createdAt", "boards.updatedAt", "boards.userId", "boards.slug", "boards.sourceId", "boardSettings.visibility", "boards.nodes", "boards.slug", "boards.banner"])
            .where("boardSettings.visibility", "=", "public")
            .orderBy("boards.createdAt", "desc")
            .limit(20)
            .execute()
            .then((boards) => {
                return boards.map((board) => ({
                    href: `/kit/${board.slug || board.id}`,
                    title: board.title,
                    linkCount: (board.nodes as unknown as Group[]).reduce((acc, group) => acc + group.items.length, 0),
                    category: "Discovery",
                    color: "bg-amber-50 text-amber-600",
                }))
            })) as Kit[];
        await env.CONTENT_CACHE.put("featured-kits", JSON.stringify(items), { expirationTtl: 60 * 15 });
    }

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
                    {items.map((kit) => (
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
