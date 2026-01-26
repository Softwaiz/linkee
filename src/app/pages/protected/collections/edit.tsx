import { PageEditor } from '@/components/editor/page-editor'
import { Collection, db } from '@db/index'
import { CollectionNotFound } from './not-found';

export default async function EditCollectionPage({ id }: { id: string }) {

    const collection = await db
        .selectFrom("boards")
        .selectAll()
        .where((eb) => eb.or([
            eb("id", "=", id),
            eb("slug", "=", id)
        ]))
        .executeTakeFirst() as unknown as Collection;

    if (!collection) {
        return <CollectionNotFound />
    }

    return <>
        <title>{`${collection?.label} - Linkee`}</title>
        <meta name="description" content={collection?.description} />
        <PageEditor collection={collection} />
    </>
}
