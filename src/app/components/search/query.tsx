import { db } from "@db/index"
import { SearchResults } from "./results";
import { getRequestInfo } from "rwsdk/worker";

export async function SearchQuery({ query }: { query: string }) {
    const ctx = getRequestInfo().ctx;
    if (!query) {
        return <></>
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

    return <SearchResults
        count={count?.count as number ?? 0}
        items={items as any}
        query={query}
    />
}