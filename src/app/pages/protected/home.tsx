import { CollectionsGrid } from '@/components/dashboard/collections-grid';
import { LinkDropZone } from '@/components/dashboard/link-drop-zone';
import { Link } from '@/components/link';
import { ContentLayout } from '@/components/page/content-layout';
import { Searchbar } from '@/components/search/layout';
import { Button } from '@/components/ui/button';
import { Collection, db } from '@db/index';
import { ChevronRight, Home, Plus } from 'lucide-react';
import { RequestInfo } from 'rwsdk/worker';

export default async function DashboardPage({ ctx }: RequestInfo) {
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
    .leftJoin("users", "boards.userId", "users.id")
    .where("boardSettings.visibility", "=", "public")
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
      "boards.banner"
    ])
    //.where("users.id", "!=", user?.id)
    .orderBy("boards.createdAt", "desc")
    .limit(20)
    .execute();

  const savedItems = await db
    .selectFrom("boards")
    .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
    .leftJoin("boardReactions", "boards.id", "boardReactions.boardId")
    .where("boardSettings.visibility", "=", "public")
    .where((eb) => eb.and([
      eb("boardReactions.userId", "=", user?.id),
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

  return <>
    <title>Your collections</title>
    <meta name="description" content="Collections your recently added collections here." />
    <ContentLayout
      header={{
        icon: <Home className='size-7' />,
        title: "Your collections",
        middle: <div className="w-full hidden md:flex flex-row items-center justify-end">
          <div className="max-w-lg w-full">
            <Searchbar />
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
          <Searchbar />
        </div>
        <LinkDropZone collections={items} />
        <div className="w-full space-y-2 bg-card/20 p-4 rounded-md border border-border text-card-foreground @container/discover">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">You own these webrings.</h1>
            <p className="text-foreground/80">
              Webrings you own are here.
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
              <h1 className="text-2xl font-bold text-foreground">They recently hit your interest.</h1>
              <Button asChild variant="outline">
                <Link href="/saved">
                  <span className="hidden md:inline-block">
                    View all
                  </span>
                  <ChevronRight />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-foreground/80">
              You were interested in these webrings.
            </p>
          </div>
          <CollectionsGrid
            hideAdd
            layoutPrefix="kit-saved"
            items={savedItems as unknown as Collection[]} />
        </div>

        <div className="w-full space-y-2 bg-card/20 p-4 rounded-md border border-border text-card-foreground @container/discover">
          <div className="space-y-1">
            <div className="w-full flex flex-row items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Explore webrings</h1>
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
              Discover curated webrings from creators around the world.
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
