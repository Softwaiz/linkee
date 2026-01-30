import { CollectionView } from '@/components/collection/collection-view'
import { Collection, db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'
import { CollectionNotFound } from './not-found';
import { Layers } from 'lucide-react';
import Page from '@/components/page';

export default async function CollectionPage({ params }: RequestInfo) {
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
        <Page.Root>
            <Page.Header.Custom container className="justify-between">
                <div className="grow flex flex-row items-center justify-start gap-2">
                    <Page.BackButton />
                    <span
                        className="p-4">
                        <Layers size={32} />
                    </span>
                    <Page.Title>Create your collection</Page.Title>
                </div>
            </Page.Header.Custom>
            <Page.Content container>
                <CollectionView
                    collection={board}
                />
            </Page.Content>
        </Page.Root>
    </>
}