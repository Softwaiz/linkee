import { CollectionView } from '@/components/collection/collection-view'
import { Collection, db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'
import { CollectionNotFound } from '../errors/not-found';
import Page from '@/components/page';
import { SingleCollectionHeader } from './header';
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { CollectionContent } from '@/pages/public/kit/content';

export default async function CollectionPage({ params, ctx }: RequestInfo) {
    const { id } = params;
    const board = await db
        .selectFrom("boards")
        .selectAll()
        .select(({ eb }) => {
            return jsonObjectFrom(
                eb.selectFrom("boardSettings")
                    .select(['visibility'])
                    .whereRef("boardSettings.boardId", "=", "boards.id")
                    .limit(1)
            ).as("settings")
        })
        .where((eb) => eb.or([
            eb("boards.id", "=", id),
            eb("boards.slug", "=", id)
        ]))
        .executeTakeFirst()

    if (!board) {
        return <CollectionNotFound />
    }

    const readOnly = ctx?.user?.id !== board.userId;
    if (readOnly && !["public", "unlisted"].includes(board?.settings?.visibility ?? "public")) {
        return <CollectionNotFound />
    }

    return <>
        <title>{`${board?.label} - Linkits`}</title>
        <meta name="description" content={board.description} />
        <Page.Root>
            <Page.Header.Custom container className="justify-between overflow-hidden gap-1">
                <SingleCollectionHeader
                    collection={board as unknown as Collection}
                    readOnly={readOnly}
                />
            </Page.Header.Custom>
            <Page.Content container={false} className='py-0'>
                <CollectionContent collection={board as unknown as Collection} />
            </Page.Content>
        </Page.Root>
    </>
}
