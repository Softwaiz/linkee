'use client'

import { useState, useCallback, DragEvent } from 'react'
import { ArrowRight, Link2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Collection } from '@db/index'
import { LinkDropDialog } from './link-drop-dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { AnimatePresence, motion } from 'motion/react'

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
        <motion.div
            className='w-full space-y-4'
            initial={{
                opacity: 0,
                y: 10
            }}
            animate={{
                opacity: 1,
                y: 0
            }}>
            <div className="w-full relative overflow-hidden flex flex-col items-center justify-center p-3 md:p-4 lg:p-12 rounded-md">
                <div className="w-full absolute top-0 left-0">
                    <div className="min-h-screen w-full relative bg-black">
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
                            }}
                        />
                    </div>
                </div>
                <div className="relative w-full flex flex-col items-start justify-center gap-4">
                    <div className="flex flex-col items-start justify-start gap-0.5">
                        <h1 className='font-display font-extrabold text-lg md:text-xl lg:text-2xl text-white'>Save your inspiration now.</h1>
                        <p className='text-white/80 text-xs md:text-sm lg:text-base opacity-75'>Don't let it fade away. Quickly save your links and access them from any device, where you need them.</p>
                    </div>
                    <div className="mt-4 w-full flex flex-col md:flex-row items-center bg-background/20 rounded-md md:rounded-full focus-within:ring-ring/50 focus-within:ring-[3px]">
                        <input
                            type="url"
                            className='w-full px-4 placeholder:text-white/60 text-white/80 border-0 h-10 lg:h-12 shadow-sm focus:outline-none focus:ring-0 text-xs md:text-sm'
                            placeholder="Copy paste your new link here."
                            value={draftUrl}
                            onChange={(ev) => {
                                setDraftUrl(ev.currentTarget.value);
                            }}
                            onKeyDown={(ev) => {
                                if (ev.key === 'Enter') {
                                    handleCollectDraft()
                                }
                            }} />
                        <motion.button
                            layout
                            onClick={handleCollectDraft}
                            className={cn(
                                'w-full md:w-auto rounded-b-md md:rounded-bl-none md:rounded-r-full bg-primary text-primary-foreground hover:bg-primary-700 transition-all duration-150 overflow-hidden',
                                !draftUrl && 'cursor-not-allowed',
                                "h-10 lg:h-12 shadow-sm",
                                "px-8 gap-2",
                                "text-xs md:text-sm font-semibold"
                            )}>
                            <AnimatePresence>
                                {isLoading ? (
                                    <motion.div
                                        key="resolving"
                                        className='flex flex-row items-center justify-center gap-2'
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <span className='uppercase leading-relaxed'>Resolving</span>
                                        <Loader2 className="size-6 lg:size-8 animate-spin" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="stale"
                                        className='flex flex-row items-center justify-center gap-2'
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <span className='uppercase leading-relaxed'>Save</span>
                                        <ArrowRight className="size-4 lg:size-8" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

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
        </motion.div>
    )
}
