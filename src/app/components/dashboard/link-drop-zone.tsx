'use client'
import { useState, useCallback, useEffect } from 'react'
import { Loader2, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Collection } from '@db/index'
import { LinkDropDialog } from './link-drop-dialog'
import { AnimatePresence, motion } from 'motion/react'

export interface ExtractedMetadata {
    url: string
    title: string
    description: string
    image?: string
    favicon?: string
}

export function LinkDropZone({ collections }: { collections: Collection[] }) {
    const [isLoading, setIsLoading] = useState(false)
    const [metadata, setMetadata] = useState<ExtractedMetadata | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [draftUrl, setDraftUrl] = useState('');

    const handleCollectDraft = useCallback(async (overrideUrl?: string | React.SyntheticEvent) => {

        const targetUrl = typeof overrideUrl === 'string' ? overrideUrl : draftUrl;
        let url = undefined;
        try {
            new URL(targetUrl);
            url = targetUrl;
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

    useEffect(() => {
        const pendingWebring = localStorage.getItem("landing_init_webring")
        if (pendingWebring) {
            const parsed = JSON.parse(pendingWebring) as {
                link: { url: string },
                title: string,
                description: string
            };
            setDraftUrl(parsed.link.url)
            localStorage.removeItem('landing_init_webring')
            // Add a small timeout to let the UI reflect the draftUrl in the input field visually
            setTimeout(() => {
                handleCollectDraft(parsed.link.url)
            }, 300)
        }
    }, [handleCollectDraft])

    const handleDialogClose = useCallback(() => {
        setDialogOpen(false)
        setMetadata(null)
    }, [])

    return (
        <motion.div
            className='w-full space-y-4 bg-card/20 p-3 lg:p-4 rounded-md border border-border text-card-foreground'
            initial={{
                opacity: 0,
                y: 10
            }}
            animate={{
                opacity: 1,
                y: 0
            }}>
            <div className="w-full relative flex flex-col items-center justify-center rounded-md">
                <div className="relative w-full flex flex-col items-start justify-center gap-4">
                    <div className="w-full flex flex-col items-start justify-start gap-2">
                        <div className="w-full md:hidden flex flex-row items-center bg-background/20 focus-within:ring-ring/50 focus-within:ring-[3px] border border-input rounded-md">
                            <input
                                type="url"
                                className='w-full px-2 lg:px-4 placeholder:text-foreground/60 text-foreground/80 border-0 h-10 focus:outline-none focus:ring-0 text-xs md:text-sm'
                                placeholder="Paste your link here."
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
                                    'w-auto rounded-md bg-primary-700 text-primary-foreground hover:bg-primary-700 transition-all duration-150 overflow-hidden',
                                    !draftUrl && 'cursor-not-allowed',
                                    "h-10 shadow-sm",
                                    "px-4 md:px-8 gap-2",
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
                                            <span className='leading-relaxed'>Save</span>
                                            <Save className="size-4 lg:size-8" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                        <div className="w-full flex flex-row items-center justify-between">
                            <h1 className='font-display font-extrabold text-lg md:text-xl lg:text-2xl text-foreground'>Save your inspiration now.</h1>
                            <div className="basis-2/3 hidden md:flex flex-row items-center bg-background/20 focus-within:ring-ring/50 focus-within:ring-[3px] border border-input rounded-md">
                                <input
                                    type="url"
                                    className='w-full px-2 lg:px-4 placeholder:text-foreground/60 text-foreground/80 border-0 h-10 focus:outline-none focus:ring-0 text-xs md:text-sm'
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
                                        'w-auto rounded-md bg-primary-700 text-primary-foreground hover:bg-primary-700 transition-all duration-150 overflow-hidden',
                                        !draftUrl && 'cursor-not-allowed',
                                        "h-10 shadow-sm",
                                        "px-4 md:px-8 gap-2",
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
                                                <Loader2 className="size-4 lg:size-8 animate-spin" />
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
                                                <span className='leading-relaxed'>Save</span>
                                                <Save className="size-4 lg:size-8" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </div>
                        <p className='text-foreground/80 text-xs md:text-sm opacity-75'>Don't let it fade away. Quickly save your links and access them from any device, where you need them.</p>
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
