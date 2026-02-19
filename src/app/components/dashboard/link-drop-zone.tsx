'use client'

import { useState, useCallback, DragEvent } from 'react'
import { ArrowRight, Link2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Collection } from '@db/index'
import { LinkDropDialog } from './link-drop-dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export interface ExtractedMetadata {
    url: string
    title: string
    description: string
    image?: string
    favicon?: string
}

export function LinkDropZone({ collections }: { collections: Collection[] }) {
    const [isDragOver, setIsDragOver] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [metadata, setMetadata] = useState<ExtractedMetadata | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const [draftUrl, setDraftUrl] = useState('');

    const extractUrl = (dataTransfer: DataTransfer): string | null => {
        // Try text/uri-list first
        const uriList = dataTransfer.getData('text/uri-list')
        if (uriList) {
            const firstUrl = uriList.split('\n').find((line) => line.trim() && !line.startsWith('#'))
            if (firstUrl) return firstUrl.trim()
        }

        // Fallback to text/plain
        const text = dataTransfer.getData('text/plain')
        if (text) {
            try {
                new URL(text.trim())
                return text.trim()
            } catch {
                return null
            }
        }

        return null
    }

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)
    }, [])

    const handleCollectDraft = useCallback(async () => {

        let url = undefined;
        try {
            new URL(draftUrl);
            url = draftUrl;
        } catch {
            url = undefined;
        }

        if (!url) return

        setIsLoading(true)

        try {
            const res = await fetch('/api/metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })
            const data = await res.json() as {
                success: boolean
                title?: string
                description?: string
                image?: string
                favicon?: string
            }

            if (data.success) {
                setMetadata({
                    url,
                    title: data.title || url,
                    description: data.description || '',
                    image: data.image || undefined,
                    favicon: data.favicon || undefined,
                })
            } else {
                setMetadata({
                    url,
                    title: url,
                    description: '',
                })
            }
            setDialogOpen(true)
        } catch {
            // Still allow the user to proceed even if metadata extraction fails
            setMetadata({
                url,
                title: url,
                description: '',
            })
            setDialogOpen(true)
        } finally {
            setIsLoading(false)
        }
    }, [draftUrl])

    const handleDrop = useCallback(async (e: DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragOver(false)

        const url = extractUrl(e.dataTransfer)
        if (!url) return

        setIsLoading(true)

        try {
            const res = await fetch('/api/metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })
            const data = await res.json() as {
                success: boolean
                title?: string
                description?: string
                image?: string
                favicon?: string
            }

            if (data.success) {
                setMetadata({
                    url,
                    title: data.title || url,
                    description: data.description || '',
                    image: data.image || undefined,
                    favicon: data.favicon || undefined,
                })
            } else {
                setMetadata({
                    url,
                    title: url,
                    description: '',
                })
            }
            setDialogOpen(true)
        } catch {
            // Still allow the user to proceed even if metadata extraction fails
            setMetadata({
                url,
                title: url,
                description: '',
            })
            setDialogOpen(true)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleDialogClose = useCallback(() => {
        setDialogOpen(false)
        setMetadata(null)
    }, [])

    return (
        <div className='w-full space-y-4'>
            <div className="w-full flex flex-col items-center justify-center py-10">
                <div className="w-full max-w-lg flex flex-col items-center justify-center gap-8">
                    <h1 className='font-display font-extrabold text-2xl text-center'>What did you find ?<br /> Collect it now.</h1>
                    <div className="w-full flex items-center gap-2">
                        <Input
                            className='rounded-full h-16'
                            placeholder="Copy paste your new link here."
                            value={draftUrl}
                            onChange={(ev) => {
                                setDraftUrl(ev.currentTarget.value);
                            }} />
                        <Button
                            className='rounded-full h-full'
                            onClick={handleCollectDraft}>
                            Save
                            <ArrowRight />
                        </Button>
                    </div>
                </div>
            </div>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 transition-all duration-300 cursor-default select-none',
                    isDragOver
                        ? 'border-accent bg-accent/10 scale-[1.01] shadow-lg shadow-accent/10'
                        : 'border-border/60 bg-muted/30 hover:border-border hover:bg-muted/50',
                    isLoading && 'opacity-70 pointer-events-none'
                )}
            >
                {isLoading ? (
                    <>
                        <div className="flex size-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                            <Loader2 className="size-5 animate-spin" />
                        </div>
                        <p className="text-sm text-muted-foreground">Extracting link info…</p>
                    </>
                ) : (
                    <>
                        <div className={cn(
                            'flex size-11 items-center justify-center rounded-full transition-colors duration-200',
                            isDragOver
                                ? 'bg-accent/20 text-accent'
                                : 'bg-muted text-muted-foreground'
                        )}>
                            <Link2 className="size-5" />
                        </div>
                        <div className="text-center">
                            <p className={cn(
                                'text-sm font-medium transition-colors duration-200',
                                isDragOver ? 'text-accent' : 'text-foreground'
                            )}>
                                Drop a link here
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Drag any URL to quickly add it to a collection
                            </p>
                        </div>
                    </>
                )}
            </div>

            {metadata && (
                <LinkDropDialog
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        if (!open) handleDialogClose()
                    }}
                    metadata={metadata}
                    collections={collections}
                />
            )}
        </div>
    )
}
