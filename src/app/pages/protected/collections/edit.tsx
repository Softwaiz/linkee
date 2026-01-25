import { PageEditor } from '@/components/editor/page-editor'
import { Collection, db } from '@db/index'

export default async function EditCollectionPage({ id }: { id: string }) {

    const collection = await db
        .selectFrom("boards")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst() as unknown as Collection;

    if (!collection) {
        return <>
            <title>404 - Collection not found</title>
            <meta name="description" content="This collection does not exist or was removed by it's author." />
        </>
    }

    return <>
        <title>{`${collection?.label} - Linkee`}</title>
        <meta name="description" content={collection?.description} />
        <PageEditor collection={collection} />
    </>
}
