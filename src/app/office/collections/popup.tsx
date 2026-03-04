import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { getCollection, GetCollectionResult } from "./queries";
import { toast } from "sonner";
import { downPlayCollection, highlightCollection } from "./actions/top-pick";
import { AnimatePresence, motion } from "motion/react";
import { Copy, Loader2, MoreVertical, Star, StarOff, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Group } from "@/validations/collection/create";
import { LinkPreview } from "@/components/collection/link-preview";
import { TextPreview } from "@/components/collection/text-preview";

export function CollectionDetailsPopup(props: { isOpen?: boolean, collectionId: string, onClose: () => void }) {
    const [loadingCollection, setLoadingCollection] = useState(false);
    const [collection, setCollection] = useState<GetCollectionResult | null>(null);

    const [refreshing, setRefreshing] = useState(false);

    const loadCollection = useCallback(async () => {
        setLoadingCollection(true);
        try {
            const collection = await getCollection(props.collectionId);
            setCollection(collection);
        } catch (error) {
            console.error("Failed to load collection", error);
        } finally {
            setLoadingCollection(false);
        }
    }, []);

    useEffect(() => {
        loadCollection();
    }, [props.collectionId]);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        await loadCollection();
        setRefreshing(false);
    }, [loadCollection]);

    const copy = useCallback(async () => {
        const toastId = `copy-link-${collection?.id}`;
        if (!collection) return;
        await navigator
            .clipboard
            .writeText(`${window.location.origin}/kit/${collection.slug || collection.id}`)
            .then(() => {
                toast.success("Link copied to clipboard!", {
                    id: toastId,
                });
            }).catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    }, [collection?.slug, collection?.id]);

    const highlightItem = useCallback(async () => {
        const toastId = `action.highlight.${collection?.id}`;

        toast.loading("Highlighting this webing...", { id: toastId });
        await highlightCollection(collection?.id || "")
            .then(async (result) => {
                if (result.success) {
                    toast.success("Highlighted as top pick", {
                        id: toastId,
                        description: <p className="text-muted-foreground">
                            {result.message || "This collection has been marked as a top pick and will be featured in the webrings."}
                        </p>
                    });
                    await refresh();
                } else {
                    toast.error(result.message || "Failed to highlight", {
                        id: toastId,
                        description: <p className="text-muted-foreground">
                            {result.message || "An error occurred while marking this collection as a top pick."}
                        </p>
                    });
                }
            })
            .catch((err) => {
                console.error("Failed to mark as top pick: ", err);
                toast.error("Failed to mark as top pick", {
                    id: toastId,
                    description: <p className="text-muted-foreground">
                        An error occurred while marking this collection as a top pick.
                    </p>
                });
            });
    }, [collection?.id]);

    const downplayItem = useCallback(async () => {
        const toastId = `action.downplay.${collection?.id}`;

        toast.loading("Downplaying this webing...", { id: toastId });
        await downPlayCollection(collection?.id || "")
            .then(async (result) => {
                if (result.success) {
                    toast.success("Downplayed this webing", {
                        id: toastId,
                        description: <p className="text-muted-foreground">
                            {result.message || "This collection has been downplayed and will no longer be featured in the webrings."}
                        </p>
                    });
                    await refresh();
                } else {
                    toast.error(result.message || "Failed to downplay", {
                        id: toastId,
                        description: <p className="text-muted-foreground">
                            {result.message || "An error occurred while downplaying this collection."}
                        </p>
                    });
                }
            })
            .catch((err) => {
                console.error("Failed to downplay collection: ", err);
                toast.error("Failed to downplay collection", {
                    id: toastId,
                    description: <p className="text-muted-foreground">
                        An error occurred while downplaying this collection.
                    </p>
                });
            });
    }, [collection?.id]);

    return (
        <motion.div layout className="w-full p-6 flex flex-col items-center justify-center gap-4">
            <AnimatePresence>
                {
                    refreshing && (<motion.div
                        key="refreshing"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 left-0 bg-yellow-600 text-yellow-200 w-full flex flex-row items-center justify-center gap-2 px-2 py-4 z-10">
                        <Loader2 className="size-4 animate-spin" />
                        <p>Refreshing this collection</p>
                    </motion.div>
                    )
                }
                {loadingCollection && (
                    <motion.div
                        key="loading"
                        className="absolute inset-0 flex flex-col items-center justify-center text-center text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Loader2 className="size-10 animate-spin" />
                        <p>Loading the collection...</p>
                    </motion.div>
                )}
                {!loadingCollection && collection && (
                    <motion.div
                        key="content"
                        className="w-full grow flex flex-col items-start justify-start gap-4 text-neutral-600"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-full flex flex-row items-center justify-start gap-2">
                            <h1 className="grow">{collection.label || 'Untitled Collection'}</h1>
                            <div className="flex flex-row items-start justify-start gap-0.5">
                                <Badge variant={collection.settings?.visibility === "public" ? "default" : "outline"}>
                                    {collection.settings?.visibility || 'public'}
                                </Badge>
                                <Badge variant={collection.isHighlighted ? "default" : "outline"}>
                                    {collection.isHighlighted ? "Highlighted" : "Not highlighted"}
                                </Badge>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-xs"
                                        size="icon-sm">
                                        <MoreVertical className="size-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        className="text-xs"
                                        onClick={copy}>
                                        <Copy className="size-4" />
                                        Copy Link
                                    </DropdownMenuItem>
                                    {collection.isHighlighted ?
                                        <DropdownMenuItem
                                            className="text-xs"
                                            onClick={() => {
                                                downplayItem()
                                            }}>
                                            <StarOff className="size-4" />
                                            Downplay this collection
                                        </DropdownMenuItem> :
                                        <DropdownMenuItem
                                            className="text-xs"
                                            onClick={() => {
                                                highlightItem()
                                            }}>
                                            <Star className="size-4" />
                                            Highlight this collection
                                        </DropdownMenuItem>
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <button
                                onClick={props.onClose}
                                className="bg-background text-foreground p-2 rounded-md hover:bg-accent transition-colors">
                                <X className="size-4" />
                            </button>
                        </div>
                        <div className="min-h-screen w-full flex flex-col items-start justify-start gap-4">
                            <CollectionDetails collection={collection} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function CollectionDetails({ collection }: { collection: NonNullable<GetCollectionResult> }) {

    const nodes = useMemo(() => {
        return (collection.nodes || []) as Group[];
    }, [collection.nodes]);

    return (
        <div className="w-full flex flex-col items-start justify-start gap-4">
            <div className="w-full flex flex-col items-start justify-start">
                <h2 className="text-base font-semibold">About this collection</h2>
                <div className="w-full flex flex-col items-start justify-start gap-1 border border-border rounded-sm">
                    <div className="flex flex-col items-start justify-start gap-0.5 px-2 py-1">
                        <span className="text-sm font-medium text-muted-foreground">Owner</span>
                        <p>{collection.owner?.firstName} {collection.owner?.lastName} <span className="text-muted-foreground">({collection?.owner?.email})</span></p>
                    </div>
                    <hr className="w-full" />
                    <div className="flex flex-col items-start justify-start gap-0.5 px-2 py-1">
                        <span className="text-sm font-medium">Visibility</span>
                        <Badge variant="outline" className="capitalize">
                            {collection.settings?.visibility || 'public'}
                        </Badge>
                    </div>
                    <hr className="w-full" />
                    <div className="flex flex-col items-start justify-start gap-0.5 px-2 py-1">
                        <span className="text-sm font-medium">Created At</span>
                        <p className="text-xs text-muted-foreground">
                            {new Date(collection.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
            <hr />
            <div className="flex flex-col items-start justify-start gap-2 mt-4">
                <h2 className="text-base font-semibold">Topics</h2>
                <div className="w-full flex flex-col items-start justify-start gap-4">
                    {
                        nodes?.length ? (
                            <div className="w-full flex flex-col items-start justify-start space-y-4">
                                {nodes.map((node) => {
                                    return <div
                                        key={node.id}
                                        className="flex flex-col items-start justify-start gap-2">
                                        <div>
                                            <h2 className="text-md font-medium">{node.title}</h2>
                                            <p className="text-xs text-muted-foreground">
                                                {node.description}
                                            </p>
                                        </div>
                                        <div className="w-full grid grid-cols-2 gap-2">
                                            {node.items.map((item) => (
                                                <Fragment key={item.id}>
                                                    {
                                                        item.type === "link" ? (
                                                            <LinkPreview link={item} />
                                                        ) : (
                                                            <TextPreview text={item} />
                                                        )
                                                    }
                                                </Fragment>
                                            ))}
                                        </div>
                                    </div>
                                })}
                            </div>
                        ) : (
                            <p>No topics found.</p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}