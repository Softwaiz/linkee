import { db } from "@db/index"
import { SearchResults } from "./results";

export async function SearchQuery({ query }: { query: string }) {

    if (!query) {
        return <></>
    }

    const [count, items] = await Promise.all([
        db.selectFrom("boards")
            .select((eb) => [
                eb.fn.countAll().as("count")
            ])
            .where((eb) => eb.or([
                eb("label", "like", `%${query}%`),
                eb("description", "like", `%${query}%`)
            ]))
            .executeTakeFirst(),
        db.selectFrom("boards")
            .select(["id", "label", "description", "createdAt", "updatedAt"])
            .where((eb) => eb.or([
                eb("label", "like", `%${query}%`),
                eb("description", "like", `%${query.toLowerCase()}%`)
            ]))
            .limit(5)
            .orderBy("createdAt", "desc")
            .execute()
    ]);

    return <SearchResults
        count={count?.count as number ?? 0}
        items={items as any}
        query={query}
    />
}