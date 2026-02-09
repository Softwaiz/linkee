import { DiscoverCard } from '@/components/discover/discover-card'
import { Collection, db } from '@db/index'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/link'
import { Lightbulb, Plus } from 'lucide-react'
import Page from '@/components/page'
import { RequestInfo } from 'rwsdk/worker'

export default async function DiscoverPage(props: RequestInfo) {

  const items = await db
    .selectFrom("boards")
    .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
    .selectAll()
    .where((eb) => (
      eb.and([
        eb("boardSettings.visibility", "=", "public"),
        ...(props.ctx.user ? [eb("boards.userId", "!=", props.ctx.user.id)] : []),
      ])
    ))
    .orderBy("createdAt", "desc")
    .execute();

  return <Page.Root>
    <Page.Header.Custom container className="justify-between">
      <div className="grow flex flex-row items-center justify-start gap-2">
        <Page.BackButton />
        <div className="grow flex flex-row items-center justify-start gap-1">
          <div className="p-2">
            <Lightbulb size={21} />
          </div>
          <Page.Title>Discover collections</Page.Title>
        </div>
      </div>
      <div>
        <Button
          variant="outline"
          asChild>
          <Link href="/collections/new">
            <Plus />
            <span className="hidden md:inline-block">
              Create yours
            </span>
          </Link>
        </Button>
      </div>
    </Page.Header.Custom>
    <Page.Content container>
      <div className="mb-4">
        <p className="mt-1 text-muted-foreground">
          Explore curated collections from creators around the world.
        </p>
      </div>
      <div className="columns-1 @[20rem]:columns-2 md:columns-3 gap-5 lg:columns-4 xl:columns-5">
        {items.map((collection) => (
          <div key={collection.id} className="mb-5 break-inside-avoid">
            <DiscoverCard collection={collection as unknown as Collection} />
          </div>
        ))}
      </div>
    </Page.Content>
  </Page.Root>
}
