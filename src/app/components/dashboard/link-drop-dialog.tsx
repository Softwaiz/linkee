'use client'

import { useState, useMemo, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Collection } from '@db/index'
import { Group } from '@/validations/collection/create'
import { ExtractedMetadata } from './link-drop-zone'
import { addLinkToCollection } from '@/actions/collections/add-link'
import { toast } from 'sonner'
import { navigate } from 'rwsdk/client'
import { ExternalLink, Globe, Layers, Plus, FolderPlus, Search, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from "motion/react";
import { searchCollections } from '@/actions/collections/search'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'

type Step = 'create-new' | 'append'

export function LinkDropDialog({
    open,
    onOpenChange,
    metadata,
    collections,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    metadata: ExtractedMetadata
    collections: Collection[]
}) {
    const [step, setStep] = useState<Step>('create-new')
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>('')
    const [selectedSectionId, setSelectedSectionId] = useState<string>('')
    const [newSectionTitle, setNewSectionTitle] = useState('')
    const [isCreatingSection, setIsCreatingSection] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const selectedCollection = useMemo(() => {
        return collections.find((c) => c.id === selectedCollectionId) || null
    }, [collections, selectedCollectionId])

    const sections: Group[] = useMemo(() => {
        if (!selectedCollection) return []
        return (selectedCollection.nodes as unknown as Group[]) || []
    }, [selectedCollection])

    const handleCreateNewCollection = () => {
        const prefillData = encodeURIComponent(JSON.stringify(metadata))
        navigate(`/collections/new?prefill=${prefillData}`)
        onOpenChange(false)
    }

    const handleAddToExisting = () => {
        setStep('append')
    }

    const handleConfirmAdd = async () => {
        if (!selectedCollectionId) return
        if (!isCreatingSection && !selectedSectionId) return
        if (isCreatingSection && !newSectionTitle.trim()) return

        setIsSaving(true)
        const toastId = 'link-drop-add'
        toast.loading('Adding link…', { id: toastId })

        try {
            const result = await addLinkToCollection(
                selectedCollectionId,
                isCreatingSection ? null : selectedSectionId,
                {
                    url: metadata.url,
                    title: metadata.title,
                    description: metadata.description,
                    image: metadata.image,
                    favicon: metadata.favicon,
                },
                isCreatingSection ? newSectionTitle.trim() : undefined
            )

            if (result.success) {
                toast.success('Link added!', {
                    id: toastId,
                    description: result.message,
                })
                onOpenChange(false)
                resetState()
            } else {
                toast.error('Failed to add link', {
                    id: toastId,
                    description: result.message,
                })
            }
        } catch {
            toast.error('Something went wrong', { id: toastId })
        } finally {
            setIsSaving(false)
        }
    }

    const resetState = () => {
        setStep('create-new')
        setSelectedCollectionId('')
        setSelectedSectionId('')
        setNewSectionTitle('')
        setIsCreatingSection(false)
    }

    const handleOpenChange = (v: boolean) => {
        if (!v) resetState()
        onOpenChange(v)
    }

    const [search, setSearch] = useState("");
    const [result, setResult] = useState<{ id: string, label: string, description: string }[]>([]);
    const searchDelay = useDebounce(500);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (open) {
            searchDelay.delay(async () => {
                setSearching(true);
                return await searchCollections(search)
                    .then((result) => {
                        if (result.items) {
                            setResult(result.items);
                        }
                    })
                    .catch((err) => {
                    })
                    .finally(() => {
                        setSearching(false);
                    })
            })
        }
        return () => {
            searchDelay.cancel();
        }
    }, [open, search]);


    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md space-y-4 max-h-[60vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {step === 'create-new' ? 'Link captured!' : 'Add to collection'}
                    </DialogTitle>
                </DialogHeader>

                {/* Link preview */}
                <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-3">
                    {metadata.favicon ? (
                        <img
                            src={metadata.favicon}
                            alt=""
                            className="size-8 rounded-md mt-0.5 shrink-0 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                    ) : (
                        <div className="flex size-8 items-center justify-center rounded-md bg-muted mt-0.5 shrink-0">
                            <Globe className="size-4 text-muted-foreground" />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight truncate">
                            {metadata.title}
                        </p>
                        {metadata.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {metadata.description}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground/60 mt-1 truncate flex items-center gap-1">
                            <ExternalLink className="size-3 shrink-0" />
                            {metadata.url}
                        </p>
                    </div>
                </div>

                <div className='w-full space-y-4'>
                    <AnimatePresence>
                        <h2>
                            What's next ?
                        </h2>
                        <motion.div className='w-full space-y-4' layout>
                            <Button
                                variant="default"
                                className="w-full justify-start gap-2 h-auto py-3"
                                onClick={handleCreateNewCollection}
                            >
                                <FolderPlus className="size-4 shrink-0" />
                                <div className="text-left">
                                    <p className="text-sm font-medium">Create a new collection</p>
                                    <p className="text-xs opacity-70">Start a collection with this link</p>
                                </div>
                            </Button>
                            <div className='w-full flex flex-row items-center justify-center gap-2'>
                                <span className="grow h-0.5 bg-border"></span>
                                <span className="text-sm text-muted-foreground uppercase">or</span>
                                <span className="grow h-0.5 bg-border"></span>
                            </div>

                            <div className="w-full space-y-4 pt-2">
                                {/* Collection picker */}
                                <div className="w-full space-y-2">
                                    <div className="sticky top-0 w-full flex flex-row items-center justify-between bg-background">
                                        <Label>Select a collection</Label>
                                        <div className="basis-3/5 relative">
                                            <Input
                                                placeholder='Start typing'
                                                value={search}
                                                onChange={(ev) => {
                                                    setSearch(ev.currentTarget.value);
                                                }} />
                                            <motion.div>
                                                <AnimatePresence>
                                                    {
                                                        searching ? (
                                                            <motion.span
                                                                className='absolute right-2 top-1/2 -translate-y-1/2'
                                                                initial={{
                                                                    y: -10,
                                                                    opacity: 0
                                                                }}
                                                                animate={{
                                                                    y: 0,
                                                                    opacity: 1
                                                                }}
                                                                exit={{
                                                                    y: -10,
                                                                    opacity: 0
                                                                }}
                                                            >
                                                                <Loader2 className='size-4 text-muted-foreground animate-spin' />
                                                            </motion.span>
                                                        ) : (
                                                            <motion.span
                                                                className='absolute right-2 top-1/2 -translate-y-1/2'
                                                                initial={{
                                                                    y: 10,
                                                                    opacity: 0
                                                                }}
                                                                animate={{
                                                                    y: 0,
                                                                    opacity: 1
                                                                }}
                                                                exit={{
                                                                    y: 10,
                                                                    opacity: 0
                                                                }}>
                                                                <Search className='size-4 text-muted-foreground' />
                                                            </motion.span>
                                                        )
                                                    }
                                                </AnimatePresence>
                                            </motion.div>
                                        </div>
                                    </div>
                                    <motion.div className='w-full flex flex-col items-start justify-start gap-2' layout>
                                        <AnimatePresence>
                                            {
                                                result.map((item) => {
                                                    const selected = selectedCollectionId === item.id;

                                                    return <motion.button
                                                        key={item.id}
                                                        data-selected={selected}
                                                        className={
                                                            cn(
                                                                'w-full flex flex-col items-start justify-start border border-input rounded-md px-3 py-2',
                                                                selected && 'border-primary bg-primary/5'
                                                            )
                                                        }
                                                        onClick={() => {
                                                            setSelectedCollectionId(item.id)
                                                            setSelectedSectionId('')
                                                            setIsCreatingSection(false)
                                                            setNewSectionTitle('')
                                                        }}
                                                        initial={{
                                                            opacity: 0,
                                                            y: -10
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -10
                                                        }}>
                                                        <p className='text-sm text-foreground'>{item.label}</p>
                                                        <p className='text-sm text-muted-foreground/50'>{item.description}</p>
                                                    </motion.button>
                                                })
                                            }
                                            {
                                                result.length === 0 && <motion.div
                                                    key="empty"
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -10
                                                    }}>
                                                    <p className='text-sm text-muted-foreground'>No collections found matching "{search}"</p>
                                                </motion.div>
                                            }
                                        </AnimatePresence>
                                    </motion.div>
                                </div>

                                {/* Section picker */}
                                {selectedCollection && (
                                    <motion.div
                                        className="space-y-2"
                                        initial={{
                                            opacity: 0,
                                            y: -10
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10
                                        }}>
                                        <Label>Topic / Group</Label>
                                        {!isCreatingSection ? (
                                            <div className="space-y-2">
                                                {sections.length > 0 && (
                                                    <Select
                                                        value={selectedSectionId}
                                                        onValueChange={setSelectedSectionId}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a topic" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {sections.map((s) => (
                                                                <SelectItem key={s.id} value={s.id}>
                                                                    {s.title || 'Untitled section'}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-xs gap-1"
                                                    onClick={() => setIsCreatingSection(true)}
                                                >
                                                    <Plus className="size-3" />
                                                    Create a new topic
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Input
                                                    value={newSectionTitle}
                                                    onChange={(e) => setNewSectionTitle(e.target.value)}
                                                    placeholder="New topic name"
                                                    autoFocus
                                                />
                                                {sections.length > 0 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-xs"
                                                        onClick={() => {
                                                            setIsCreatingSection(false)
                                                            setNewSectionTitle('')
                                                        }}
                                                    >
                                                        Pick existing topic instead
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSelectedCollectionId('')
                            setSelectedSectionId('')
                            setIsCreatingSection(false)
                            setNewSectionTitle('')
                            handleOpenChange(false);
                        }}
                    >
                        Back
                    </Button>
                    <Button
                        size="sm"
                        disabled={
                            isSaving ||
                            !selectedCollectionId ||
                            (!isCreatingSection && !selectedSectionId) ||
                            (isCreatingSection && !newSectionTitle.trim())
                        }
                        onClick={handleConfirmAdd}
                    >
                        {isSaving ? 'Adding…' : 'Add link'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
