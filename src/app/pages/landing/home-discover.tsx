import { PublicDiscoverCard } from "@/components/discover/discover-card";
import { Collection, db } from "@db/index";

export async function HomeDiscover() {
    const items = await db
        .selectFrom("boards")
        .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
        .select(["boards.id", "boards.label", "boards.description", "boards.createdAt", "boards.updatedAt", "boards.userId", "boards.slug", "boards.sourceId", "boardSettings.visibility", "boards.nodes", "boards.slug", "boards.banner"])
        .where("boardSettings.visibility", "=", "public")
        .orderBy("boards.createdAt", "desc")
        .limit(20)
        .execute();

    console.log("items: ", items);

    return <div className="container mx-auto space-y-4">
        <div className="my-20 columns-2 gap-5 xs:columns-2 sm:columns-2 lg:columns-3">
            {items.map((collection) => (
                <div key={collection.id} className="mb-5 break-inside-avoid">
                    <PublicDiscoverCard collection={collection as unknown as Collection} />
                </div>
            ))}
        </div>
    </div>
}