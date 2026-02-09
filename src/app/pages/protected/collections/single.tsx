import { CollectionView } from '@/components/collection/collection-view'
import { Collection, db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'
import { CollectionNotFound } from './not-found';
import Page from '@/components/page';
import { SingleCollectionHeader } from './single-header';

export default async function CollectionPage({ params, ctx }: RequestInfo) {
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

    const readOnly = ctx?.user?.id !== board.userId;
    if (readOnly && !["public", "unlisted"].includes(board?.visibility ?? "public")) {
        return <CollectionNotFound />
    }

    return <>
        <title>{`${board?.label} - Linkee`}</title>
        <meta name="description" content={board.description} />
        <Page.Root>
            <Page.Header.Custom container className="justify-between">
                <SingleCollectionHeader
                    collection={board as unknown as Collection}
                    readOnly={readOnly}
                />
            </Page.Header.Custom>
            <Page.Content container>
                <CollectionView
                    collection={board as unknown as Collection}
                />
            </Page.Content>
        </Page.Root>
    </>
}