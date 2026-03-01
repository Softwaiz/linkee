import { Collection, db } from "@db/index";
import { RequestInfo } from "rwsdk/worker";
import { CollectionsMasonry } from "@/components/collection/grid";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/link";
import { ContentLayout } from "@/components/page/content-layout";
import { SearchLayout } from "@/components/search/layout";
import { CollectionCard } from "@/components/collection/card";

export default async function SavedCollections(props: RequestInfo) {

    const collections = await db
        .selectFrom("boards")
        .innerJoin("boardReactions", "boards.id", "boardReactions.boardId")
        .selectAll("boards")
        .where("boardReactions.userId", "=", props.ctx.user!.id)
        .where("boardReactions.type", "=", "save")
        .execute();

    return <>
        <title>Collections you saved</title>
        <meta name="description" content="Explore curated collections from creators around the world." />
        <ContentLayout
            header={{
                icon: <Heart className='size-7' />,
                title: "Collections you saved",
                middle: <div className="w-full flex flex-row items-center justify-end">
                    <div className="max-w-lg w-full">
                        <SearchLayout />
                    </div>
                </div>,
                actions: <>
                    <Button
                        asChild>
                        <Link href="/collections/new">
                            <Plus />
                            <span className="hidden md:inline-block">
                                Create yours
                            </span>
                        </Link>
                    </Button>
                </>
            }}>
            <div className="w-full space-y-4 md:space-y-6 lg:space-y-8 @container/discover">
                <div className="w-full flex flex-col items-start justify-start">
                    <h1 className='text-lg lg:text-2xl font-bold text-foreground'>You previously saved these kits.</h1>
                </div>
                <div className="w-full flex md:hidden flex-row items-center justify-end @container/search">
                    <SearchLayout />
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collections.map(collection => (
                        <CollectionCard
                            key={collection.id}
                            layoutId={collection.id}
                            bannerLayoutId={collection.id + "-banner"}
                            collection={collection as unknown as Collection}
                        />
                    ))}
                </div>
            </div>
        </ContentLayout>
    </>
}