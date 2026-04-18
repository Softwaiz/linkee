import { db } from "@db/index";
import { env } from "cloudflare:workers";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/sqlite";

export class CollectionResolver {
    static async getCollection(collectionId: string) {
        return db.selectFrom("boards")
            .selectAll()
            .select(
                ({ eb }) => {
                    return [
                        jsonObjectFrom(
                            eb.selectFrom("users")
                                .select(["id", "firstName", "lastName", "alias", "email", "createdAt", "updatedAt"])
                                .whereRef("users.id", "=", "boards.userId")
                                .limit(1)
                        )
                            .as("owner"),
                        jsonObjectFrom(
                            eb.selectFrom("boardSettings")
                                .select(['visibility'])
                                .whereRef("boardSettings.boardId", "=", "boards.id")
                                .limit(1)
                        )
                            .as("settings"),
                        jsonArrayFrom(
                            eb.selectFrom("boardTags")
                                .innerJoin("tags", "tags.id", "boardTags.tagId")
                                .select(["tagId", "tags.canonicalLabelEn", "tags.canonicalLabelFr"])
                                .whereRef("boardTags.boardId", "=", "boards.id")
                        ).as("tags")
                    ]
                }
            )
            .where("id", "=", collectionId)
            .executeTakeFirst();
    }

    static async highlightCollection(collectionId: string) {
        const collection = await this.getCollection(collectionId);
        if (!collection) {
            throw new Error("Collection not found");
        };
        const cache = await env.CONTENT_CACHE.get<string[]>(`webrings:highlighted`, "json") || [];
        let set = new Set(cache);

        if (collection.isHighlighted) {
            throw new Error("Collection is already highlighted");
        }

        await db.updateTable("boards").set({ isHighlighted: 1 }).where("id", "=", collectionId).execute();

        set.add(collection.id);
        await env.CONTENT_CACHE.put("webrings:highlighted", JSON.stringify([...set]));

        return [...set];
    }

    static async downplayCollection(collectionId: string) {
        const collection = await this.getCollection(collectionId);
        if (!collection) {
            throw new Error("Collection not found");
        };
        const cache = await env.CONTENT_CACHE.get<string[]>(`webrings:highlighted`, "json") || [];
        let set = new Set(cache);

        if (!collection.isHighlighted) {
            throw new Error("Collection is not highlighted");
        }

        await db.updateTable("boards").set({ isHighlighted: 0 }).where("id", "=", collectionId).execute();

        set.delete(collection.id);
        await env.CONTENT_CACHE.put("webrings:highlighted", JSON.stringify([...set]));

        return [...set];
    }

    static async getCollections({ onlyPrivate, onlyPublic, onlyUnlisted}:  { onlyPrivate: boolean, onlyPublic: boolean, onlyUnlisted: boolean }) {
        let query = db.selectFrom("boards")
            .innerJoin("users", "users.id", "boards.userId")
            .leftJoin("boardSettings", "boardSettings.boardId", "boards.id")
            .select([
                "boards.id",
                "boards.label",
                "boards.createdAt",
                "users.firstName",
                "users.lastName",
                "users.email",
                "boardSettings.visibility"
            ]);

        if (onlyPrivate) {
            query = query.where("boardSettings.visibility", "=", "private");
        } else if (onlyPublic) {
            query = query.where((eb) => eb.or([
                eb("boardSettings.visibility", "=", "public"),
                eb("boardSettings.visibility", "is", null)
            ]));
        } else if (onlyUnlisted) {
            query = query.where("boardSettings.visibility", "=", "unlisted");
        }

        const collections = await query.orderBy("boards.createdAt", "desc").execute();

        return {
            items: collections
        }

    }

    static async getHighlightedCollections() {
        const highlightedIds = await env.CONTENT_CACHE.get<string[]>(`webrings:highlighted`, "json") || [];
        if (highlightedIds.length === 0) {
            return [];
        }
        let items = await db.selectFrom("boards")
            .innerJoin("users", "users.id", "boards.userId")
            .leftJoin("boardSettings", "boardSettings.boardId", "boards.id")
            .select([
                "boards.id",
                "boards.label",
                "boards.createdAt",
                "users.firstName",
                "users.lastName",
                "users.email",
                "boardSettings.visibility"
            ])
            .where("boards.id", "in", highlightedIds)
            .execute();

        items.sort((a, b) => {
            const aIndex = highlightedIds.indexOf(a.id);
            const bIndex = highlightedIds.indexOf(b.id);
            return aIndex - bIndex;
        });
        return items;
    }
}