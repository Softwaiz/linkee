import { CollectionsGrid } from '@/components/dashboard/collections-grid'
import { Collection, db } from '@db/index';
import { DefaultAppContext } from 'rwsdk/worker';

export default async function DashboardPage({ctx}: {ctx: DefaultAppContext}) {
  const user = ctx.user!;
  const items = (await db
    .selectFrom("boards")
    .selectAll()
    .where("userId", "=", user?.id)
    .orderBy("createdAt","asc")
    .execute()
  ) as unknown as Collection[];
  return <CollectionsGrid items={items} />
}
