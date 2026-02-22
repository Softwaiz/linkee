import { db } from "@db/index";
import { TrendingSection } from "./trending-section.content"
import { env } from "cloudflare:workers";

export interface TrendingItem {
    href: string;
    title: string;
}

const trendingItems: TrendingItem[] = [
    { href: "#", title: "Learn The Web" },
    { href: "#", title: "Peter Pistorius" },
    { href: "#", title: "Sans Permission" },
    { href: "#", title: "Productivity Stack 2026" },
    { href: "#", title: "Design Systems Hub" },
    { href: "#", title: "Startup Toolkit" },
    { href: "#", title: "Frontend Roadmap" },
]

export async function TrendingSectionSSR() {
    let items = await env.CONTENT_CACHE.get("trending-items", "json");
    if (!items) {
        items = await db
            .selectFrom("boards")
            .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
            .select(["boards.id", "boards.label as title", "boards.description", "boards.createdAt", "boards.updatedAt", "boards.userId", "boards.slug", "boards.sourceId", "boardSettings.visibility", "boards.nodes", "boards.slug", "boards.banner"])
            .where("boardSettings.visibility", "=", "public")
            .orderBy("boards.createdAt", "desc")
            .limit(20)
            .execute()
            .then((boards) => boards.map((board) => ({
                href: `/kit/${board.slug || board.id}`,
                title: board.title,
            })));
        await env.CONTENT_CACHE.put("trending-items", JSON.stringify(items), { expirationTtl: 60 * 15 });
    }

    return (
        <TrendingSection items={items as TrendingItem[]} />
    )
}
