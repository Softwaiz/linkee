import { CollectionView } from '@/components/collection/collection-view'
import { Button } from '@/components/ui/button';
import { Collection, db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'
import { CollectionNotFound } from '../protected/collections/not-found';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default async function PublicCollectionPage({ params }: RequestInfo) {
    const { id } = params;
    const board = await db
        .selectFrom("boards")
        .selectAll()
        .where((eb) => eb.or([
            eb("id", "=", id),
            eb("slug", "=", id)
        ]))
        .executeTakeFirst() as unknown as Collection;

    if (!board) {
        return <CollectionNotFound />
    }

    return <>
        <title>{`${board?.label} - Linkee`}</title>
        <meta name="description" content={board.description} />
        <Header />
        <CollectionView
            collection={board}
            readOnly={true}
        />
        <Footer />
    </>
}
