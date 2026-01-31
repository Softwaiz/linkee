import { DiscoverCard, PublicDiscoverCard } from "@/components/discover/discover-card";
import { Collection, db } from "@db/index";

export async function HomeDiscover() {
    const items = await db.selectFrom("boards").selectAll().orderBy("createdAt", "desc").limit(10).execute();

    return <div className="container mx-auto space-y-4">
        <div className="w-full flex flex-col items-center justify-center gap-2">
            <h1 className="text-2xl lg:text-4xl">
                Discover new collections around you.
            </h1>
            <p className="text-sm lg:text-lg opacity-75">
                Here are few collections that might spark your interest.
            </p>
        </div>
        <div className="my-20 columns-2 gap-5 xs:columns-2 sm:columns-2 lg:columns-3">
            {items.map((collection) => (
                <div key={collection.id} className="mb-5 break-inside-avoid">
                    <PublicDiscoverCard collection={collection as unknown as Collection} />
                </div>
            ))}
        </div>
    </div>
}