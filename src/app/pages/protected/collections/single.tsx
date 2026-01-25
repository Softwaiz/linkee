import { CollectionView } from '@/components/collection/collection-view'
import { Button } from '@/components/ui/button';
import { Collection, db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'

export default async function CollectionPage({ params }: RequestInfo) {
    const { id } = params;
    const board = await db
        .selectFrom("boards")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst() as unknown as Collection;

    if (!board) {
        return <div>
            <title>404 -  Collection not found</title>
            <h1>
                The requested collection was not found.
                <Button asChild>
                    <a href="/collections/new">
                        Create yours.
                    </a>
                </Button>
            </h1>
            <p>
                The owner may have removed it from public view,or deleted it.
            </p>
        </div>
    }

    return <>
        <title>{`${board?.label} - Linkee`}</title>
        <meta name="description" content={board.description} />
        <CollectionView
            collection={board}
        />
    </>
}