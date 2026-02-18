import { CollectionView } from '@/components/collection/collection-view'
import { Collection, db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'
import { CollectionNotFound } from '../protected/collections/not-found';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { jsonObjectFrom } from "kysely/helpers/sqlite";

export default async function PublicCollectionPage({ params, ctx }: RequestInfo) {
    const { id } = params;
    const board = await db
        .selectFrom("boards")
        .selectAll()
        .select(({ eb, fn }) => {
            const selects: any[] = [
                jsonObjectFrom(
                    eb.selectFrom("boardSettings")
                        .select(['visibility'])
                        .whereRef("boardSettings.boardId", "=", "boards.id")
                        .limit(1)
                ).as("settings"),
                eb.selectFrom("boardReactions")
                    .select(fn.count<number>("id").as("count"))
                    .whereRef("boardId", "=", "boards.id")
                    .where("type", "=", "like")
                    .as("likesCount"),
                eb.selectFrom("boardReactions")
                    .select(fn.count<number>("id").as("count"))
                    .whereRef("boardId", "=", "boards.id")
                    .where("type", "=", "save")
                    .as("savesCount"),
            ];

            if (ctx.user) {
                selects.push(
                    eb.selectFrom("boardReactions")
                        .select("id")
                        .whereRef("boardId", "=", "boards.id")
                        .where("userId", "=", ctx.user.id)
                        .where("type", "=", "like")
                        .as("isLiked")
                );
                selects.push(
                    eb.selectFrom("boardReactions")
                        .select("id")
                        .whereRef("boardId", "=", "boards.id")
                        .where("userId", "=", ctx.user.id)
                        .where("type", "=", "save")
                        .as("isSaved")
                );
            }

            return selects;
        })
        .where((eb) => eb.or([
            eb("boards.id", "=", id),
            eb("boards.slug", "=", id)
        ]))
        .executeTakeFirst();

    if (!board) {
        return <CollectionNotFound />
    }

    if (!["public", "unlisted"].includes(board.settings?.visibility ?? "public")) {
        return <CollectionNotFound />
    }

    const selectedImage = board.picture;

    return <>
        <title>{`${board?.label} - Linkits`}</title>
        <meta name="description" content={board.description} />
        {selectedImage && <link rel="icon" href={selectedImage} type="image/x-icon" />}
        <Header />
        <CollectionView
            collection={board as unknown as Collection}
            readOnly={true}
            likesCount={Number(board.likesCount ?? 0)}
            savesCount={Number(board.savesCount ?? 0)}
            isLiked={Boolean(board.isLiked)}
            isSaved={Boolean(board.isSaved)}
        />
        <Footer />
    </>
}