import { PageEditor } from '@/components/editor/page-editor'
import { Collection, db } from '@db/index'
import { CollectionNotFound } from './errors/not-found';
import { RequestInfo } from 'rwsdk/worker';
import { LayersPlus } from 'lucide-react';
import Page from '@/components/page';
import { jsonObjectFrom } from "kysely/helpers/sqlite";

export default async function EditCollectionPage({ ctx, params, request }: RequestInfo) {
    const id = params.id;

    const collection = await db
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
        <title>{`${collection?.label} - Linkits`}</title>
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
                    collection={collection as unknown as Collection}
                    settings={{
                        boardId: collection.id,
                        ...collection.settings
                    } as any} />
            </Page.Content>
        </Page.Root>
    </>
}
