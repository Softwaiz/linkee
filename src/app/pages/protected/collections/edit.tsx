import { PageEditor } from '@/components/editor/page-editor'
import { Collection, db } from '@db/index'
import { CollectionNotFound } from './not-found';
import { RequestInfo } from 'rwsdk/worker';
import { LayersPlus } from 'lucide-react';
import Page from '@/components/page';

export default async function EditCollectionPage({ params }: RequestInfo) {
    const id = params.id;

    const collection = await db
        .selectFrom("boards")
        .selectAll()
        .where((eb) => eb.or([
            eb("id", "=", id),
            eb("slug", "=", id)
        ]))
        .executeTakeFirst() as unknown as Collection;

    const settings = await db.selectFrom("boardSettings")
        .selectAll()
        .where("boardId", "=", collection?.id)
        .executeTakeFirst();

    if (!collection) {
        return <CollectionNotFound />
    }

    return <>
        <title>{`${collection?.label} - Linkee`}</title>
        <meta name="description" content={collection?.description} />
        <Page.Root>
            <Page.Content container>
                <PageEditor
                    header={
                        <div className="grow flex flex-row items-center justify-start gap-2">
                            <Page.BackButton />
                            <span
                                className="p-4">
                                <LayersPlus size={32} />
                            </span>
                            <Page.Title>Editing {collection.label}</Page.Title>
                        </div>
                    }
                    collection={collection}
                    settings={{
                        boardId: collection.id,
                        ...settings
                    } as any} />
            </Page.Content>
        </Page.Root>
    </>
}
