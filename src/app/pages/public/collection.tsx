import { CollectionView } from '@/components/collection/collection-view'
import { Collection, db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'
import { CollectionNotFound } from '../protected/collections/not-found';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { Group } from '@/validations/collection/create';

export default async function PublicCollectionPage({ params, ctx }: RequestInfo) {
    const { id } = params;
    const board = await db
        .selectFrom("boards")
        .selectAll()
        .select(({ eb, fn }) => {

            const selects: any[] = [
                jsonObjectFrom(
                    eb.selectFrom("users")
                        .select(["alias", "firstName", "lastName"])
                        .whereRef("users.id", "=", "boards.userId")
                        .limit(1)
                ).as("user"),
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
    const ogImage = board.banner || board.picture || 'https://linkits.xyz/og-image.png';
    const collectionUrl = `https://linkits.xyz/shared/${board.slug || board.id}`;
    const authorName = board.users
        ? [board.user.firstName, board.user.lastName].filter(Boolean).join(' ') || board.user.alias || 'Linkits User'
        : 'Linkits User';

    return <>
        <title>{`${board.label} — a link kit on Linkits`}</title>
        <meta name="description" content={board.description || `A curated link kit by ${authorName} on Linkits.`} />
        <link rel="canonical" href={collectionUrl} />
        {selectedImage && <link rel="icon" href={selectedImage} type="image/x-icon" />}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Linkits" />
        <meta property="og:title" content={`${board.label} — a link kit on Linkits`} />
        <meta property="og:description" content={board.description || `A curated link kit by ${authorName} on Linkits.`} />
        <meta property="og:url" content={collectionUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={board.label} />
        <meta property="article:author" content={authorName} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@linkits" />
        <meta name="twitter:title" content={`${board.label} — a link kit on Linkits`} />
        <meta name="twitter:description" content={board.description || `A curated link kit by ${authorName} on Linkits.`} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={board.label} />

        <Header />
        <CollectionView
            collection={board as unknown as Collection}
            readOnly
            isPublicView
            likesCount={Number(board.likesCount ?? 0)}
            savesCount={Number(board.savesCount ?? 0)}
            isLiked={Boolean(board.isLiked)}
            isSaved={Boolean(board.isSaved)}
        />
        <Footer />
        <script type="application/ld+json">
            {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": board.label,
                "description": board.description,
                "url": collectionUrl,
                "creator": {
                    "@type": "Person",
                    "name": authorName,
                },
                "itemListElement": (board.nodes as unknown as Group[]).flatMap((group, groupIndex) =>
                    group.items
                        .filter((item) => item.type === "link")
                        .map((item, itemIndex) => ({
                            "@type": "ListItem",
                            "position": groupIndex * 100 + itemIndex + 1,
                            "name": item.title,
                            "url": item.url
                        }))
                ),
            }, null, 2)}
        </script>
    </>
}