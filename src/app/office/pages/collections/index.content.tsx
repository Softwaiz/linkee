"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

export type CollectionRow = {
    id: string;
    label: string | null;
    createdAt: string;
    firstName: string;
    lastName: string;
    email: string;
    visibility: string | null;
};

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
]


export function CollectionContent(props: { title: string, items: CollectionRow[] }) {
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
    </Card>
}