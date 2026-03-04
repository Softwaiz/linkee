"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popup } from "@/components/ui/custom-popup";
import { DataTable } from "@/components/ui/data-table";
import { type GetCollectionResult } from "@/office/collections/queries";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Loader2, MoreVertical, Star, StarOff, X } from "lucide-react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Group } from "@/validations/collection/create";
import { LinkPreview } from "@/components/collection/link-preview";
import { TextPreview } from "@/components/collection/text-preview";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { highlightCollection, downPlayCollection } from "@/office/collections/actions/top-pick";
import { toast } from "sonner";
import { CollectionDetailsPopup } from "@/office/collections/popup";

export type CollectionRow = {
    id: string;
    label: string | null;
    createdAt: string;
    firstName: string;
    lastName: string;
    email: string;
    visibility: string | null;
};

export function CollectionContent(props: { title: string, items: CollectionRow[] }) {
    const [selectedRow, setSelectedRow] = useState<CollectionRow | null>(null);

    const columns: ColumnDef<CollectionRow>[] = [
        {
            accessorKey: "label",
            header: "Collection",
            cell: ({ row }) => {
                return (
                    <div className="font-medium">
                        {row.original.label || 'Untitled'}
                    </div>
                )
            },
        },
        {
            accessorKey: "owner",
            header: "Owner",
            cell: ({ row }) => {
                return (
                    <div>
                        {row.original.firstName} {row.original.lastName} <span className="text-muted-foreground">({row.original.email})</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "visibility",
            header: "Visibility",
            cell: ({ row }) => {
                return (
                    <Badge variant="outline" className="capitalize">
                        {row.original.visibility || 'public'}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => {
                return (
                    <div className="text-muted-foreground">
                        {new Date(Number(row.original.createdAt)).toLocaleDateString()}
                    </div>
                )
            },
        },
        {
            accessorKey: "id",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setSelectedRow(row.original);
                            setPopupOpen(true);
                        }}
                    >
                        Open
                    </Button>
                )
            },
        },
    ];

    const [popupOpen, setPopupOpen] = useState(false);

    return <Card>
        <CardHeader>
            <CardTitle>{props.title}</CardTitle>
            <CardDescription>
                {props.items.length} collection{props.items.length !== 1 ? 's' : ''} found.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <DataTable columns={columns} data={props.items} />
        </CardContent>

        {selectedRow && (
            <Popup
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                className="bg-card text-card-foreground rounded-lg shadow-lg border"
            >
                <CollectionDetailsPopup
                    isOpen={popupOpen}
                    collectionId={selectedRow.id}
                    onClose={() => setPopupOpen(false)} />
            </Popup>
        )}
    </Card>
}
