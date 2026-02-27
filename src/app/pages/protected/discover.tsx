import { DiscoverCard } from '@/components/discover/discover-card'
import { Collection, db } from '@db/index'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/link'
import { Lightbulb, Plus } from 'lucide-react'
import { RequestInfo } from 'rwsdk/worker'
import { ContentLayout } from '@/components/page/content-layout'
import { SearchLayout } from '@/components/search/layout'

export default async function DiscoverPage(props: RequestInfo) {

  const items = await db
    .selectFrom("boards")
    .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
    .select(["boards.id", "boards.label", "boards.description", "boards.createdAt", "boards.updatedAt", "boards.userId", "boards.slug", "boards.sourceId", "boardSettings.visibility", "boards.nodes", "boards.slug", "boards.banner"])
    .where("boardSettings.visibility", "=", "public")
    .orderBy("boards.createdAt", "desc")
    .limit(20)
    .execute();

  return <>
    <title>Discover collections</title>
    <meta name="description" content="Explore curated collections from creators around the world." />
    <ContentLayout
      header={{
        icon: <Lightbulb className='size-7' />,
        title: "Discover collections",
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
          <h1 className='text-lg lg:text-2xl font-bold text-foreground'>These kits are public.</h1>
          <p className="text-sm text-foreground/80">
            Explore curated collections from creators around the world.
          </p>
        </div>
        <div className="w-full flex md:hidden flex-row items-center justify-end @container/search">
          <SearchLayout />
        </div>

        <div
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {items.map((collection) => (
            <DiscoverCard key={collection.id} collection={collection as unknown as Collection} />
          ))}
        </div>
      </div>
    </ContentLayout>
  </>
}
