import { Group } from "@/validations/collection/create";
import { db } from "@db/index";
import { env } from "cloudflare:workers";
import { jsonArrayFrom } from "kysely/helpers/sqlite";

export class UserCollectionResolver {
    static async getHighlightedCollections() {
        const highlightedIds = await env.CONTENT_CACHE.get<string[]>(`webrings:highlighted`, "json") || [];

        if (highlightedIds.length === 0) {
            return [];
        }

        let items = await db
            .selectFrom("boards")
            .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
            .leftJoin("users", "boards.userId", "users.id")
            .select((eb) => {
                return [
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
                    "users.lastName",
                    jsonArrayFrom(
                        eb.selectFrom("boardTags")
                            .innerJoin("tags", "tags.id", "boardTags.tagId")
                            .select(["tagId", "tags.canonicalLabelEn as labelEn", "tags.canonicalLabelFr as labelFr"])
                            .whereRef("boardTags.boardId", "=", "boards.id")
                    ).as("tags")
                ]
            })
            .where("boardSettings.visibility", "=", "public")
            .where("boards.id", "in", highlightedIds)
            .orderBy("boards.createdAt", "desc")
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
                    category: board.tags,
                    color: "bg-amber-50 text-amber-600",
                    userAlias: board.alias ? board.alias : undefined,
                    userFullName: `${board.firstName} ${board.lastName}`,
                    slug: board.slug,
                    nodes: board.nodes || [],
                    banner: board.banner,
                }));
            });

        items.sort((a, b) => {
            const aIndex = highlightedIds.indexOf(a.id);
            const bIndex = highlightedIds.indexOf(b.id);
            return aIndex - bIndex;
        });

        return items;

    }

    static async getHighlightedCollectionWithCaching() {
        const cache = await env.CONTENT_CACHE.get<Awaited<ReturnType<typeof this.getHighlightedCollections>>>(`webrings:highlighted:data`, "json");
        if (cache) {
            return cache;
        }
        const items = await this.getHighlightedCollections();
        if(items.length > 0) {
            await env.CONTENT_CACHE.put(`webrings:highlighted:data`, JSON.stringify(items), { expirationTtl: 60 * 5 });
        }
        return items;
    }
}

export type HighlightedCollection = Awaited<ReturnType<typeof UserCollectionResolver.getHighlightedCollections>>[number];