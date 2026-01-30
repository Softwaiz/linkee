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

    if (!collection) {
        return <CollectionNotFound />
    }

    return <>
        <title>{`${collection?.label} - Linkee`}</title>
        <meta name="description" content={collection?.description} />
        <Page.Root>
            <Page.Header.Custom container className="justify-between">
                <div className="grow flex flex-row items-center justify-start gap-2">
                    <Page.BackButton />
                    <span
                        className="p-4">
                        <LayersPlus size={32} />
                    </span>
                    <Page.Title>Editing {collection.label}</Page.Title>
                </div>
            </Page.Header.Custom>
            <Page.Content container>
                <PageEditor collection={collection} />
            </Page.Content>
        </Page.Root>
    </>
}
