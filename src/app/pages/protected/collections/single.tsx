import { CollectionView } from '@/components/collection/collection-view'
import { Collection, db } from '@db/index';
import { RequestInfo } from 'rwsdk/worker'
import { CollectionNotFound } from './not-found';
import { Layers, MoreHorizontal, Pencil, Share2, SquareStack } from 'lucide-react';
import Page from '@/components/page';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SingleCollectionHeader } from './single-header';

export default async function CollectionPage({ params, ctx }: RequestInfo) {
    const { id } = params;
    const board = await db
        .selectFrom("boards")
        .selectAll()
        .where((eb) => eb.or([
            eb("id", "=", id),
            eb("slug", "=", id)
        ]))
        .executeTakeFirst() as unknown as Collection;

    const readOnly = ctx?.user?.id !== board.userId;

    if (!board) {
        return <CollectionNotFound />
    }

    return <>
        <title>{`${board?.label} - Linkee`}</title>
        <meta name="description" content={board.description} />
        <Page.Root>
            <Page.Header.Custom container className="justify-between">
                <SingleCollectionHeader
                    collection={board}
                    readOnly={readOnly}
                />
            </Page.Header.Custom>
            <Page.Content container>
                <CollectionView
                    collection={board}
                />
            </Page.Content>
        </Page.Root>
    </>
}