import { CollectionView } from '@/components/collection/collection-view'
import { Collection, db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'
import { CollectionNotFound } from '../protected/collections/not-found';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default async function PublicCollectionPage({ params }: RequestInfo) {
    const { id } = params;
    const board = await db
        .selectFrom("boards")
        .leftJoin("boardSettings", "boards.id", "boardSettings.boardId")
        .selectAll()
        .where((eb) => eb.or([
            eb("boards.id", "=", id),
            eb("boards.slug", "=", id)
        ]))
        .executeTakeFirst();

    if (!board) {
        return <CollectionNotFound />
    }

    if (!["public", "unlisted"].includes(board.visibility ?? "public")) {
        return <CollectionNotFound />
    }

    const selectedImage = board.picture;

    return <>
        <title>{`${board?.label} - Linkee`}</title>
        <meta name="description" content={board.description} />
        {selectedImage && <link rel="icon" href={selectedImage} type="image/x-icon" />}
        <Header />
        <CollectionView
            collection={board as unknown as Collection}
            readOnly={true}
        />
        <Footer />
    </>
}