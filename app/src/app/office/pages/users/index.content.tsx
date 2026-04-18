"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

type UserRow = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
};

const columns: ColumnDef<UserRow>[] = [
    {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
            return (
                <div className="font-medium">
                    {row.original.firstName} {row.original.lastName}
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            return row.original.role === 'admin' ? (
                <Badge variant="default">Admin</Badge>
            ) : (
                <Badge variant="secondary">User</Badge>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => {
            return (
                <div className="text-muted-foreground">
                    {new Date(Number(row.original.createdAt)).toLocaleDateString()}
                </div>
            )
        },
    },
]

export function UsersPageContent(props: { title: string, items: UserRow[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{props.title}</CardTitle>
                <CardDescription>
                    {props.items.length} user{props.items.length !== 1 ? 's' : ''} found.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable columns={columns} data={props.items} />
            </CardContent>
        </Card>
    );
}