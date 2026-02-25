import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tag?: any;
    onSave: (data: any) => Promise<void>;
}

export function TagDialog({ open, onOpenChange, tag, onSave }: TagDialogProps) {
    const isEdit = !!tag;
    const [id, setId] = useState("");
    const [labelEn, setLabelEn] = useState("");
    const [labelFr, setLabelFr] = useState("");
    const [synonymsEn, setSynonymsEn] = useState("");
    const [synonymsFr, setSynonymsFr] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (tag) {
                setId(tag.id);
                setLabelEn(tag.canonicalLabelEn);
                setLabelFr(tag.canonicalLabelFr);
                setSynonymsEn(tag.synonymsEn.join(", "));
                setSynonymsFr(tag.synonymsFr.join(", "));
            } else {
                setId("");
                setLabelEn("");
                setLabelFr("");
                setSynonymsEn("");
                setSynonymsFr("");
            }
        }
    }, [open, tag]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                id: isEdit ? undefined : id,
                canonicalLabelEn: labelEn,
                canonicalLabelFr: labelFr,
                synonymsEn: synonymsEn.split(",").map(s => s.trim()).filter(Boolean),
                synonymsFr: synonymsFr.split(",").map(s => s.trim()).filter(Boolean)
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Edit Tag" : "Create Tag"}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? "Update the tag labels and synonyms." : "Add a new tag to the system. The ID cannot be changed once created."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="id" className="text-right">
                                ID
                            </Label>
                            <Input
                                id="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                className="col-span-3"
                                placeholder="tag:frontend-dev"
                                required
                                disabled={isEdit}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="labelEn">English Label</Label>
                            <Input
                                id="labelEn"
                                value={labelEn}
                                onChange={(e) => setLabelEn(e.target.value)}
                                placeholder="Frontend"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="labelFr">French Label</Label>
                            <Input
                                id="labelFr"
                                value={labelFr}
                                onChange={(e) => setLabelFr(e.target.value)}
                                placeholder="Développement Front"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="synonymsEn">English Synonyms (comma-separated)</Label>
                            <Input
                                id="synonymsEn"
                                value={synonymsEn}
                                onChange={(e) => setSynonymsEn(e.target.value)}
                                placeholder="UI dev, client-side, web UI"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="synonymsFr">French Synonyms (comma-separated)</Label>
                            <Input
                                id="synonymsFr"
                                value={synonymsFr}
                                onChange={(e) => setSynonymsFr(e.target.value)}
                                placeholder="interface, UI web"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
