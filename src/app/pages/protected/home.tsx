import { CollectionsGrid } from '@/components/dashboard/collections-grid';
import { LinkDropZone } from '@/components/dashboard/link-drop-zone';
import { DiscoverCard } from '@/components/discover/discover-card';
import { Link } from '@/components/link';
import { ContentLayout } from '@/components/page/content-layout';
import { SearchLayout } from '@/components/search/layout';
import { Button } from '@/components/ui/button';
import { Collection, db } from '@db/index';
import { ArrowRightFromLine, ChevronRight, Home, Plus } from 'lucide-react';
import { DefaultAppContext } from 'rwsdk/worker';

export default async function DashboardPage({ ctx }: { ctx: DefaultAppContext }) {
  const user = ctx.user!;
  const items = (await db
    .selectFrom("boards")
    .selectAll()
    .where("userId", "=", user?.id)
    .orderBy("createdAt", "asc")
    .execute()
  ) as unknown as Collection[];

  const discoverableItems = await db
    .selectFrom("boards")
    .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
    .select(["boards.id", "boards.label", "boards.description", "boards.createdAt", "boards.updatedAt", "boards.userId", "boards.slug", "boards.sourceId", "boardSettings.visibility", "boards.nodes", "boards.slug", "boards.banner"])
    .where("boardSettings.visibility", "=", "public")
    .orderBy("boards.createdAt", "desc")
    .limit(20)
    .execute();

  return <>
    <title>Your collections</title>
    <meta name="description" content="Collections your recently added collections here." />
    <ContentLayout
      header={{
        icon: <Home className='size-7' />,
        title: "Your collections",
        middle: <div className="w-full hidden md:flex flex-row items-center justify-end">
          <div className="max-w-lg w-full">
            <SearchLayout />
          </div>
        </div>,
        actions: <Button
          variant="default"
          asChild>
          <Link href="/collections/new">
            <Plus />
            <span className="hidden md:inline-block">
              Create a collection
            </span>
          </Link>
        </Button>
      }}>
      <div className="w-full space-y-4 @container/home">
        <div className="w-full flex md:hidden flex-row items-center justify-end @container/search">
          <SearchLayout />
        </div>
        <LinkDropZone collections={items} />
        <div className="w-full space-y-2 bg-card/20 p-4 rounded-md border border-border text-card-foreground @container/discover">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Your collections</h1>
            <p className="text-foreground/80">
              Collections your recently added collections here.
            </p>
          </div>
          <CollectionsGrid
            hideAdd={false}
            layoutPrefix="kit-owned"
            items={items as unknown as Collection[]} />
        </div>
        <div className="w-full space-y-2 bg-card/20 p-4 rounded-md border border-border text-card-foreground @container/discover">
          <div className="space-y-1">
            <div className="w-full flex flex-row items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Explore collections</h1>
              <Button asChild variant="outline">
                <Link href="/discover">
                  <span className="hidden md:inline-block">
                    Explore all
                  </span>
                  <ChevronRight />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-foreground/80">
              Discover curated collections from creators around the world.
            </p>
          </div>
          <CollectionsGrid
            hideAdd
            layoutPrefix="kit-discover"
            items={discoverableItems as unknown as Collection[]} />
        </div>
      </div>
    </ContentLayout>
  </>
}
