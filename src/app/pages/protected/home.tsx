import { CollectionsGrid } from '@/components/dashboard/collections-grid';
import { Link } from '@/components/link';
import Page from '@/components/page';
import { Button } from '@/components/ui/button';
import { Collection, db } from '@db/index';
import { Home, Plus } from 'lucide-react';
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

  return <Page.Root>
    <Page.Header.Custom container className="justify-between">
      <div className="grow flex flex-row items-center justify-start gap-2">
        <div className="p-4">
          <Home size={21} />
        </div>
        <Page.Title>Your collections</Page.Title>
      </div>
      <div>
        <Button
          variant="outline"
          size="icon-sm" asChild>
          <Link href="/collections/new">
            <Plus />
          </Link>
        </Button>
      </div>
    </Page.Header.Custom>
    
    <Page.Content container>
      <CollectionsGrid items={items} />
    </Page.Content>
  </Page.Root>
}

/*

    */