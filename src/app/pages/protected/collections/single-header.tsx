"use client";
import { Link } from "@/components/link";
import Page from "@/components/page";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collection } from "@db/index";
import { Layers, MoreHorizontal, Pencil, Share2, SquareStack } from "lucide-react";
import { toast } from "sonner";

export function SingleCollectionHeader({ collection: board, readOnly = false }: { collection: Collection, readOnly?: boolean }) {
    return <>
        <div className="grow flex flex-row items-center justify-start gap-2">
            <Page.BackButton />
            <span
                className="p-4">
                <Layers size={32} />
            </span>
            <Page.Title>{board.label}</Page.Title>
        </div>
        <div className="flex items-center gap-2">
            {!readOnly && (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/shared/${board.slug || board.id}`)
                                .then(() => {
                                    toast.success("Link copied", { id: `${board.id}.copy_link` });
                                });
                        }}
                    >
                        <Share2 className="size-4" />
                        <span className="hidden sm:inline">Share</span>
                    </Button>
                    <Button size="sm" className="gap-2" asChild>
                        <Link href={`/collections/${board.id}/edit`}>
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
    </>
}