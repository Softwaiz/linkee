import { CollectionsGrid } from '@/components/dashboard/collections-grid'
import { Page, Section } from '@/lib/types';
import { db } from '@db/index';
import { DefaultAppContext } from 'rwsdk/worker';

export default async function DashboardPage({ctx}: {ctx: DefaultAppContext}) {
  const user = ctx.user!;
  const items = await db.selectFrom("boards").selectAll().where("userId", "=", user?.id).execute();

  const mapped = items.map((item) => {
    return {
      id: item.id,
      title: item.label,
      description: item.description,
      sections: item.nodes as unknown as Section[],
    } satisfies Page;
  });

  return <CollectionsGrid items={mapped} />
}
