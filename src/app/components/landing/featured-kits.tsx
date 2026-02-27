import { ArrowRight, ArrowUpRight, ExternalLink, Layers3, User } from "lucide-react"
import { Link } from "../link"
import { env } from "cloudflare:workers"
import { db } from "@db/index"
import { Group } from "@/validations/collection/create"
import { Button } from "../ui/button"

interface Kit {
    href: string;
    title: string;
    description: string;
    topicCount: number;
    linkCount: number;
    category: string;
    color: string;
    banner?: string;
    userAlias?: string;
    userFullName?: string;
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
                    href: `/kit/${board.slug || board.id}`,
                    title: board.title,
                    description: board.description,
                    topicCount: (board.nodes as unknown as Group[]).length,
                    linkCount: (board.nodes as unknown as Group[]).reduce((acc, group) => acc + group.items.length, 0),
                    category: "Discovery",
                    color: "bg-amber-50 text-amber-600",
                    userAlias: board.alias ? `@${board.alias}` : undefined,
                    userFullName: `${board.firstName} ${board.lastName}`,
                }))
            })) as Kit[];
        await env.CONTENT_CACHE.put("featured-kits", JSON.stringify(items), { expirationTtl: 60 * 15 });
    }

    return (
        <section id="kits" className="px-6 py-16 md:py-20" aria-labelledby="featured-kits-heading">
            <div className="mx-auto max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                    href={"/collections/new"}
                    className="w-full group bg-card/5 border border-card hover:bg-card/50 duration-200 transition-all rounded-md flex flex-col items-center justify-start"
                >
                    <div className="grow flex flex-col items-start justify-start gap-1">
                        <img
                            src={"https://fastly.picsum.photos/id/402/600/180.jpg?hmac=tGbMRulUvCgU0agW7HvyKaaWH6bEnU0-b-UefhnMIHs"}
                            alt={"Your collection banner"}
                            className="w-full object-cover object-center rounded-t-md h-46"
                        />
                        <div className="flex flex-col items-start justify-start px-3 py-4">
                            <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-foreground/80">
                                Your collection name
                            </h3>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <p>
                                    <span className="text-xs inline-flex items-center mr-2">
                                        <Layers3 className="size-3 inline-block mr-2" aria-hidden="true" />
                                        04 topics
                                    </span>
                                    <span className="text-xs inline-flex items-center">
                                        <ExternalLink className="size-3 inline-block mr-2" aria-hidden="true" />
                                        12 links
                                    </span>
                                </p>
                            </div>
                            <p className="mt-1 w-full text-xs leading-relaxed text-muted-foreground">
                                Your collection description will be here
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="bg-card rounded-full p-1.5">
                                    <User className="size-3.5" aria-hidden="true" />
                                </span>
                                <span className="text-xs">
                                    @You
                                </span>
                                <Button size="sm" variant="link" asChild>
                                    <Link href="/collections/new">
                                        Create yours <ArrowRight className="ml-0.5 size-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                    </div>
                </Link>
                {items.map((kit) => (
                    <Link
                        href={kit.href}
                        key={kit.title}
                        className="w-full group bg-card/5 border border-card hover:bg-card/50 duration-200 transition-all rounded-md flex flex-col items-center justify-start"
                    >
                        <div className="grow flex flex-col items-start justify-start gap-1">
                            <img
                                src={kit.banner ?? "https://fastly.picsum.photos/id/402/600/180.jpg?hmac=tGbMRulUvCgU0agW7HvyKaaWH6bEnU0-b-UefhnMIHs"}
                                alt={kit.title}
                                className="w-full object-cover object-center rounded-t-md h-46"
                            />
                            <div className="flex flex-col items-start justify-start px-3 py-4">
                                <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-foreground/80">
                                    {kit.title}
                                </h3>
                                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <p>
                                        <span className="text-xs inline-flex items-center mr-2">
                                            <Layers3 className="size-3 inline-block mr-2" aria-hidden="true" />
                                            {kit.topicCount} topic{kit.topicCount !== 1 ? "s" : ""}
                                        </span>
                                        <span className="text-xs inline-flex items-center">
                                            <ExternalLink className="size-3 inline-block mr-2" aria-hidden="true" />
                                            {kit.linkCount} link{kit.linkCount !== 1 ? "s" : ""}
                                        </span>
                                    </p>
                                </div>
                                <p className="mt-1 w-full text-xs leading-relaxed text-muted-foreground">
                                    {kit.description}
                                </p>
                                <div className="mt-2 flex items-center gap-1.5">
                                    <span className="bg-card rounded-full p-1.5">
                                        <User className="size-3.5" aria-hidden="true" />
                                    </span>
                                    <span className="text-xs">
                                        {kit.userAlias || kit.userFullName}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </Link>
                ))}
            </div>
        </section >
    )
}
