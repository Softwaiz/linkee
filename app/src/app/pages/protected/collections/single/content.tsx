"use client";
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

export default function CollectionPageContent({ collection, readOnly = false }: { collection: Collection, readOnly?: boolean }) {
    return <>
        <title>{`${collection?.label} - Linkits`}</title>
        <meta name="description" content={collection.description} />
        <ContentLayout header={{
            icon: <Layers className="size-6 lg:size-8" />,
            title: collection.label,
            actions: <div className="flex items-center gap-2">
                {!readOnly && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-transparent"
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/kit/${collection.slug || collection.id}`)
                                    .then(() => {
                                        toast.success("Link copied", { id: `${collection.id}.copy_link` });
                                    });
                            }}
                        >
                            <Share2 className="size-4" />
                            <span className="hidden sm:inline">Share</span>
                        </Button>
                        <Button size="sm" className="gap-2" asChild>
                            <Link href={`/collections/${collection.id}/edit`}>
                                <Pencil className="size-4" />
                                Edit
                            </Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem>Export</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
                {readOnly && (
                    <Button size="sm" asChild>
                        <Link href="/collections/new">
                            Create Yours
                            <SquareStack className="size-4" />
                        </Link>
                    </Button>
                )}
            </div>
        }} >
            <CollectionContent collection={collection} />
        </ContentLayout>
    </>
}
