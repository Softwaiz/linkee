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
                    "boards.label",
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
                    ...board,
                    href: `/kit/${board.slug || board.id}`,
                    title: board.label,
                    description: board.description,
                    topicCount: (board.nodes as unknown as Group[])?.length ?? 0,
                    linkCount: (board.nodes as unknown as Group[])?.reduce((acc, group) => acc + (group.items?.length ?? 0), 0),
                    category: board.tags,
                    userAlias: board.alias ? board.alias : undefined,
                    userFullName: `${board.firstName} ${board.lastName}`,
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
        if (items.length > 0) {
            await env.CONTENT_CACHE.put(`webrings:highlighted:data`, JSON.stringify(items), { expirationTtl: 60 * 5 });
        }
        return items;
    }

    static async getDiscoverableCollections(pageSize: number = 20) {
        return await db
            .selectFrom("boards")
            .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
            .leftJoin("users", "boards.userId", "users.id")
            .select([
                "boards.id",
                "boards.label",
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
            .limit(pageSize)
            .execute();
    }

    static async getUserCollections(userId: string | null) {
        return db
            .selectFrom("boards")
            .selectAll()
            .where("userId", "=", userId)
            .orderBy("createdAt", "asc")
            .execute();
    }

    static async getSavedItems(userId: string) {
        return db
            .selectFrom("boards")
            .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
            .leftJoin("boardReactions", "boards.id", "boardReactions.boardId")
            .where("boardSettings.visibility", "=", "public")
            .where((eb) => eb.and([
                eb("boardReactions.userId", "=", userId),
                eb("boardReactions.type", "=", "save")
            ]))
            .select([
                "boards.id",
                "boards.label",
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
            ])
            .orderBy("boardReactions.createdAt", "desc")
            .limit(20)
            .execute();
    }
}

export type DiscoverCollectionData = Awaited<ReturnType<typeof UserCollectionResolver.getDiscoverableCollections>>[number];
export type HighlightedCollection = Awaited<ReturnType<typeof UserCollectionResolver.getHighlightedCollections>>[number];