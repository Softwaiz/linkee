"use server";
import { db } from "@db/index";
import { getRequestInfo, serverQuery } from "rwsdk/worker";

export const searchCollections = serverQuery(async (search: string = "") => {
    const { ctx: { user } } = getRequestInfo();
    if (!user || !search) return {
        items: []
    }

    const collections = await db.selectFrom("boards")
        .select(["id", "label", "description"])
        .where("userId", "=", user.id)
        .where("label", "like", `%${search}%`)
        .execute();

    return { items: collections };
}, { method: "GET" });


export const appbarSearch = serverQuery(async (query: string = "") => {
    const { ctx } = getRequestInfo();
    if (!query) {
        return {
            count: 0,
            items: []
        }
    }

    const [count, items] = await Promise.all([
        db.selectFrom("boards")
            .innerJoin("boardSettings", "boards.id", "boardSettings.boardId")
            .select((eb) => [
                eb.fn.countAll().as("count")
            ])
            .where((eb) => eb.or([
                eb.and([
                    eb("userId", "=", ctx.user?.id ?? ""),
                    eb.or([
                        eb("label", "like", `%${query}%`),
                        eb("description", "like", `%${query}%`)
                    ])
                ]),
                eb.and([
                    eb("boardSettings.visibility", "=", "public"),
                    eb.or([
                        eb("label", "like", `%${query}%`),
                        eb("description", "like", `%${query}%`)
                    ])
                ])
            ]))
            .executeTakeFirst(),
        db.selectFrom("boards")
            .innerJoin("boardSettings", "boards.id", "boardSettings.boardId")
            .select(["boards.id as id", "boards.slug as slug", "boards.label as label", "boards.description as description", "boards.createdAt as createdAt", "boards.updatedAt as updatedAt"])
            .where((eb) => eb.or([
                eb.and([
                    eb("userId", "=", ctx.user?.id ?? ""),
                    eb.or([
                        eb("label", "like", `%${query}%`),
                        eb("description", "like", `%${query}%`)
                    ])
                ]),
                eb.and([
                    eb("boardSettings.visibility", "=", "public"),
                    eb.or([
                        eb("label", "like", `%${query}%`),
                        eb("description", "like", `%${query}%`)
                    ])
                ])
            ]))
            .limit(10)
            .orderBy("createdAt", "desc")
            .execute()
    ]);

    return {
        count: (count?.count ?? 0) as number,
        items
    }
})