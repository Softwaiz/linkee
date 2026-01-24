import { CollectionView } from '@/components/collection/collection-view'
import { Page, Section } from '@/lib/types';
import { db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'

export default async function CollectionPage({ params }: RequestInfo) {
    const { id } = params;
    const board = await db.selectFrom("boards").selectAll().where("id", "=", id).executeTakeFirst();

    if (board) {
        let item = {
            id: board.id,
            title: board.label,
            description: board.description,
            sections: board.nodes as unknown as Section[],
        } satisfies Page;

        return <CollectionView
            collection={item}
        />
    }

    return <div>
        <h1>The requested collection was not found.</h1>
        <p>
            The owner may have removed it from public view,or deleted it.
        </p>
    </div>
}