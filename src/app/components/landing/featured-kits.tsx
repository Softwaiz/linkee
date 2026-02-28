import { env } from "cloudflare:workers"
import { db } from "@db/index"
import { Group } from "@/validations/collection/create"
import { Button } from "../ui/button"
import { Link } from "../link"
import { ArrowRight } from "lucide-react"
import { FeaturedKitsGrid } from "./featured-kits-grid"

interface Kit {
    id: string;
    href: string;
    title: string;
    description: string | null;
    topicCount: number;
    linkCount: number;
    category: string;
    color: string;
    banner?: string | null;
    userAlias?: string;
    userFullName?: string;
    slug?: string | null;
    nodes: unknown;
}

export async function FeaturedKits() {
    let items = await env.CONTENT_CACHE.get("featured-kits", "json") as Kit[];
    if (!items) {
        items = (await db
            .selectFrom("boards")
            .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
            .leftJoin("users", "boards.userId", "users.id")
            .select([
                "boards.id",
                "boards.banner",
                "boards.label as title",
                "boards.description",
                "boards.createdAt",
                "boards.updatedAt",
                "boards.userId",
                "boards.slug",
                "boards.sourceId",
                "boardSettings.visibility",
                "boards.nodes",
                "boards.slug",
                "boards.banner",
                "users.alias",
                "users.firstName",
                "users.lastName"
            ])
            .where("boardSettings.visibility", "=", "public")
            .orderBy("boards.createdAt", "desc")
            .limit(50)
            .execute()
            .then((boards) => {
                return boards.map((board) => ({
                    id: board.id,
                    href: `/kit/${board.slug || board.id}`,
                    title: board.title,
                    description: board.description,
                    topicCount: (board.nodes as unknown as Group[])?.length ?? 0,
                    linkCount: (board.nodes as unknown as Group[])?.reduce((acc, group) => acc + (group.items?.length ?? 0), 0),
                    category: "Discovery",
                    color: "bg-amber-50 text-amber-600",
                    userAlias: board.alias ? board.alias : undefined,
                    userFullName: `${board.firstName} ${board.lastName}`,
                    slug: board.slug,
                    nodes: board.nodes || [],
                    banner: board.banner,
                }))
            })) as Kit[];
        await env.CONTENT_CACHE.put("featured-kits", JSON.stringify(items), { expirationTtl: 60 * 15 });
    }

    return (
        <section id="kits" className="px-6 py-16 md:py-24 bg-muted/30 border-t border-border" aria-labelledby="featured-kits-heading">
            <div className="w-full max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">Recently added kits</h1>
                <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* CTA card */}
                    <Link
                        title="Create your own collection now."
                        href={"/collections/new"}
                        className="w-full group bg-card/5 border border-card hover:bg-card/50 duration-200 transition-all rounded-md flex flex-col items-center justify-start"
                    >
                        <div className="grow flex flex-col items-start justify-start gap-1 w-full">
                            <img
                                src={"https://fastly.picsum.photos/id/110/600/400.jpg?hmac=SwlqtGTf9bmTozBRccGd3Y8G25aXw4ucHtAegJaFRhk"}
                                alt={"Your collection banner"}
                                className="w-full object-cover object-center rounded-t-md h-46"
                            />
                            <div className="w-full flex flex-col items-start justify-start px-3 py-4">
                                <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-foreground/80">
                                    Your collection name
                                </h3>
                                <p className="mt-1 w-full text-xs leading-relaxed text-muted-foreground">
                                    Your collection description will be here
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Button size="sm" variant="link" asChild>
                                        <Link href="/collections/new">
                                            Create yours <ArrowRight className="ml-0.5 size-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Link>
                    <FeaturedKitsGrid items={items} />
                </div>
            </div>
        </section>
    )
}
