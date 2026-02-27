import { Collection, CollectionSettings, db } from '@db/index'
import { CollectionNotFound } from '../errors/not-found';
import { RequestInfo } from 'rwsdk/worker';
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/sqlite";
import EditCollectionPageContent from './content';

export default async function EditCollectionPage({ ctx, params, request }: RequestInfo) {
    const id = params.id;

    const collection = await db
        .selectFrom("boards")
        .selectAll()
        .select(({ eb }) => {
            return [
                jsonObjectFrom(
                    eb.selectFrom("boardSettings")
                        .select(['visibility'])
                        .whereRef("boardSettings.boardId", "=", "boards.id")
                        .limit(1)
                ).as("settings"),
                jsonArrayFrom(
                    eb.selectFrom("boardTags")
                        .select("tagId")
                        .whereRef("boardTags.boardId", "=", "boards.id")
                ).as("tags")
            ]
        }).where((eb) => eb.or([
            eb("boards.id", "=", id),
            eb("boards.slug", "=", id)
        ]))
        .executeTakeFirst();

    if (!collection) {
        return <CollectionNotFound />
    }

    if (ctx.user?.id !== collection.userId) {
        return new Response("Not allowed", {
            headers: {
                'Location': new URL(request.url).origin + `/collections/${collection.slug || collection.id}`
            }
        })
    }

    return <>
        <title>{`Editing ${collection?.label} - Linkits`}</title>
        <meta name="description" content={collection?.description} />
        <EditCollectionPageContent
            collection={collection as unknown as Collection}
            settings={collection.settings as CollectionSettings}
            tags={collection.tags?.map(t => t.tagId) || []}
        />
    </>
}
