import { Collection, db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'
import { CollectionNotFound } from '../errors/not-found';
import Page from '@/components/page';
import { SingleCollectionHeader } from './header';
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { CollectionContent } from '@/pages/public/kit/content';
import { ContentLayout } from '@/components/page/content-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/link';
import { Layers, MoreHorizontal, Pencil, Share2, SquareStack } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CollectionPageContent from './content';

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
        <CollectionPageContent
            collection={board as unknown as Collection}
            readOnly={readOnly} />
    </>
}
