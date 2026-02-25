"use client";

import { useState, useEffect } from "react";
import { getTagsWithCounts, createTag, updateTag, deleteTag } from "@/actions/tags";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TagDialog } from "./components/tag-dialog";
import { toast } from "sonner";

export function TagsContent() {
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<any | null>(null);

    const loadTags = async () => {
        setLoading(true);
        try {
            const data = await getTagsWithCounts();
            setTags(data);
        } catch (error) {
            toast.error("Failed to load tags");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTags();
    }, []);

    const handleCreate = () => {
        setEditingTag(null);
        setDialogOpen(true);
    };

    const handleEdit = (tag: any) => {
        setEditingTag(tag);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tag? The collections will not be deleted, but they will lose this tag.")) return;

        try {
            await deleteTag(id)
                .then((value) => {
                    if (value.success) {
                        toast.success("Tag deleted successfully");
                    }
                    else {
                        toast.error(value.message);
                    }
                })
            loadTags();
        } catch (error) {
            toast.error("Failed to delete the tag");
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (editingTag) {
                await updateTag(editingTag.id, {
                    canonicalLabelEn: data.canonicalLabelEn,
                    canonicalLabelFr: data.canonicalLabelFr,
                    synonymsEn: data.synonymsEn,
                    synonymsFr: data.synonymsFr
                })
                    .then((value) => {
                        if (value.success) {
                            toast.success("Tag updated successfully");
                        }
                        else {
                            toast.error(value.message);
                        }
                    })
            } else {
                await createTag(data)
                    .then((value) => {
                        if (value.success) {
                            toast.success("Tag created successfully");
                        }
                        else {
                            toast.error(value.message);
                        }
                    })
            }
            setDialogOpen(false);
            loadTags();
        } catch (error) {
            toast.error(editingTag ? "Failed to update the tag. Does the ID already exist?" : "Failed to create the tag.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
                    <p className="text-muted-foreground">
                        Manage tags for categorizing collections.
                    </p>
                </div>
                <Button onClick={handleCreate}>
                    <PlusCircle className="mr-2 size-4" />
                    Create Tag
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Tags</CardTitle>
                    <CardDescription>
                        A list of all tags and their associated board counts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Label (EN)</TableHead>
                                <TableHead>Label (FR)</TableHead>
                                <TableHead>Synonyms</TableHead>
                                <TableHead className="text-right">Boards</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">Loading tags...</TableCell>
                                </TableRow>
                            ) : tags.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">No tags found.</TableCell>
                                </TableRow>
                            ) : (
                                tags.map((tag) => (
                                    <TableRow key={tag.id}>
                                        <TableCell className="font-medium">{tag.id}</TableCell>
                                        <TableCell>{tag.canonicalLabelEn}</TableCell>
                                        <TableCell>{tag.canonicalLabelFr}</TableCell>
                                        <TableCell>
                                            <div className="text-xs text-muted-foreground">
                                                <span className="font-semibold text-foreground">EN:</span> {tag.synonymsEn.join(", ") || "-"}
                                                <br />
                                                <span className="font-semibold text-foreground">FR:</span> {tag.synonymsFr.join(", ") || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">{tag.boardCount}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(tag)}>
                                                    <Edit2 className="size-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(tag.id)}>
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <TagDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                tag={editingTag}
                onSave={handleSave}
            />
        </div>
    );
}
