'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, Share2, Pencil, Bookmark, ExternalLink, Layers3, User, ArrowRight, Heart } from 'lucide-react'
import { Collection } from '@db/index'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/link'
import { LinkPreview } from './link-preview'
import { toggleReaction } from '@/actions/collections/react'
import { toast } from 'sonner'
import posthog from 'posthog-js'
import { cn } from '@/lib/utils'
import { navigate } from 'rwsdk/client'

interface CollectionPopupProps {
    layoutId?: string;
    bannerLayoutId?: string;
    collection: Collection & {
        userAlias?: string | null
        userFullName?: string | null
    }
    isOpen: boolean
    isOwner: boolean
    onClose: () => void
    initialIsSaved?: boolean
}

export function CollectionPopup({
    layoutId: layoutId = "collection",
    bannerLayoutId = "banner",
    collection,
    isOpen,
    isOwner,
    onClose,
    initialIsSaved = false,
}: CollectionPopupProps) {
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const [isSaved, setIsSaved] = useState(initialIsSaved)
    const openedAtRef = useRef<number | null>(null)
    const posthogFiredRef = useRef(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const totalLinks = collection.nodes.reduce(
        (acc, section) => acc + section.items.filter(i => i.type === 'link').length,
        0
    )
    const totalTopics = collection.nodes.length
    const creator = collection.userAlias
        ? `@${collection.userAlias}`
        : collection.userFullName || null

    const href = `/collections/${collection.slug || collection.id}`
    const publicHref = `/kit/${collection.slug || collection.id}`
    const editHref = `/collections/${collection.slug || collection.id}/edit`

    // PostHog: fire once after 3s open
    useEffect(() => {
        if (isOpen) {
            openedAtRef.current = Date.now()
            posthogFiredRef.current = false
            timerRef.current = setTimeout(() => {
                if (!posthogFiredRef.current) {
                    posthogFiredRef.current = true
                    posthog.capture('collection_popup_engaged', {
                        collectionId: collection.id,
                        collectionSlug: collection.slug,
                        collectionLabel: collection.label,
                        isOwner,
                        durationMs: 3000,
                    })
                }
            }, 3000)
        } else {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [isOpen, collection.id, collection.label, isOwner])

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    const handleSave = async () => {
        const newIsSaved = !isSaved
        setIsSaved(newIsSaved)
        try {
            const result = await toggleReaction(collection.id, 'save')
            if (!result.success) throw new Error(result.message)
            toast.success(newIsSaved ? 'Saved to your library' : 'Removed from your library')
        } catch {
            setIsSaved(!newIsSaved)
            toast.error('Failed to save collection')
        }
    }

    const handleShare = () => {
        const url = `${window.location.origin}${publicHref}`
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Link copied to clipboard!')
        })
    }

    const visibleSections = activeSection
        ? collection.nodes.filter(s => s.id === activeSection)
        : collection.nodes

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    <motion.div
                        key="popup"
                        layoutId={layoutId}
                        className={cn(
                            'fixed z-50 inset-x-4 top-[50%] -translate-y-[50%]',
                            'mx-auto max-w-2xl',
                            'bg-background border border-border rounded-2xl shadow-2xl',
                            'flex flex-col overflow-hidden',
                            'max-h-[90vh]',
                            "overflow-y-auto"
                        )}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Banner */}
                        <div className="relative w-full shrink-0">
                            <motion.img
                                layoutId={bannerLayoutId}
                                src={
                                    collection.banner ||
                                    'https://fastly.picsum.photos/id/110/600/400.jpg?hmac=SwlqtGTf9bmTozBRccGd3Y8G25aXw4ucHtAegJaFRhk'
                                }
                                alt={collection.label}
                                className="w-full h-44 object-cover object-center"
                            />
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 size-8 flex items-center justify-center rounded-full bg-black/40 text-white/90 hover:bg-black/60 transition-colors"
                                aria-label="Close popup"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="bg-card/80 px-5 pt-4 pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-bold text-foreground leading-tight">
                                            {collection.label || 'Untitled Collection'}
                                        </h2>
                                        {collection.description && (
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                {collection.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Layers3 className="size-3" />
                                        {totalTopics} topic{totalTopics !== 1 ? 's' : ''}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <ExternalLink className="size-3" />
                                        {totalLinks} link{totalLinks !== 1 ? 's' : ''}
                                    </span>
                                    {creator && (
                                        <span className="inline-flex items-center gap-1.5">
                                            <User className="size-3" />
                                            {creator}
                                        </span>
                                    )}
                                </div>

                                {/* Topic filter chips */}
                                {collection.nodes.length > 1 && (
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => setActiveSection(null)}
                                            className={cn(
                                                'px-2.5 py-1 rounded-full text-xs font-medium transition-colors border',
                                                activeSection === null
                                                    ? 'bg-foreground text-background border-foreground'
                                                    : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40'
                                            )}
                                        >
                                            All
                                        </button>
                                        {collection.nodes.map(section => (
                                            <button
                                                key={section.id}
                                                onClick={() =>
                                                    setActiveSection(prev => (prev === section.id ? null : section.id))
                                                }
                                                className={cn(
                                                    'px-2.5 py-1 rounded-full text-xs font-medium transition-colors border',
                                                    activeSection === section.id
                                                        ? 'bg-foreground text-background border-foreground'
                                                        : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40'
                                                )}
                                            >
                                                {section.title || 'Untitled'}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="px-5 py-4 space-y-6">
                                {visibleSections.length > 0 ? (
                                    visibleSections.map(section => {
                                        const links = section.items.filter(i => i.type === 'link')
                                        if (links.length === 0) return null
                                        return (
                                            <div key={section.id} className="space-y-2">
                                                {collection.nodes.length > 1 && (
                                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                        {section.title || 'Untitled Section'}
                                                    </h3>
                                                )}
                                                <div className="space-y-2">
                                                    {links.map(item => (
                                                        <LinkPreview key={item.id} link={item} />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No links in this collection yet.
                                    </p>
                                )}
                            </div>

                            {/* Action toolbar */}
                            <div className="sticky bottom-0 left-0 bg-card px-5 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0">
                                <Link
                                    href={href}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
                                >
                                    Open full page →
                                </Link>

                                <div className="flex items-center gap-2">
                                    {isOwner ? (
                                        <>
                                            <Button size="sm" variant="outline" onClick={handleShare}>
                                                <Share2 className="size-3.5 mr-1.5" />
                                                Share
                                            </Button>
                                            <Button size="sm" asChild>
                                                <Link href={editHref}>
                                                    <Pencil className="size-3.5 mr-1.5" />
                                                    Edit
                                                </Link>
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant={isSaved ? 'default' : 'outline'}
                                            onClick={handleSave}
                                        >
                                            <Bookmark className={cn('size-3.5 mr-1.5', isSaved && 'fill-current')} />
                                            {isSaved ? 'Saved' : 'Save'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export function PublicCollectionPopup({
    layoutId: layoutId = "collection",
    bannerLayoutId = "banner",
    collection,
    isOpen,
    onClose,
}: Omit<CollectionPopupProps, 'isOwner'>) {
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const openedAtRef = useRef<number | null>(null)
    const posthogFiredRef = useRef(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const totalLinks = collection.nodes.reduce(
        (acc, section) => acc + section.items.filter(i => i.type === 'link').length,
        0
    )
    const totalTopics = collection.nodes.length
    const creator = collection.userAlias
        ? `@${collection.userAlias}`
        : collection.userFullName || null

    const href = `/collections/${collection.slug || collection.id}`
    const publicHref = `/kit/${collection.slug || collection.id}`
    const editHref = `/collections/${collection.slug || collection.id}/edit`

    // PostHog: fire once after 3s open
    useEffect(() => {
        if (isOpen) {
            openedAtRef.current = Date.now()
            posthogFiredRef.current = false
            timerRef.current = setTimeout(() => {
                if (!posthogFiredRef.current) {
                    posthogFiredRef.current = true
                    posthog.capture('public_collection_popup_engaged', {
                        collectionId: collection.id,
                        collectionSlug: collection.slug,
                        collectionLabel: collection.label,
                        durationMs: 3000,
                    })
                }
            }, 3000)
        } else {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [isOpen, collection.id, collection.label])

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, onClose])

    const handleSave = async () => {
        navigate(`/home?save=${collection.id}`)
    }

    const handleShare = () => {
        const url = `${window.location.origin}${publicHref}`
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Link copied to clipboard!')
        })
    }

    const visibleSections = activeSection
        ? collection.nodes.filter(s => s.id === activeSection)
        : collection.nodes

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    <motion.div
                        key="popup"
                        layoutId={layoutId}
                        className={cn(
                            'fixed z-50 inset-x-4 top-[50%] -translate-y-[50%]',
                            'mx-auto max-w-2xl',
                            'bg-background border border-border rounded-2xl shadow-2xl',
                            'flex flex-col overflow-hidden',
                            'max-h-[90vh]',
                            "overflow-y-auto"
                        )}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Banner */}
                        <div className="relative w-full shrink-0">
                            <motion.img
                                layoutId={bannerLayoutId}
                                src={collection.banner || "https://fastly.picsum.photos/id/110/600/400.jpg?hmac=SwlqtGTf9bmTozBRccGd3Y8G25aXw4ucHtAegJaFRhk"}
                                alt={collection.label}
                                className="w-full h-44 object-cover object-center"
                            />
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 size-8 flex items-center justify-center rounded-full bg-black/40 text-white/90 hover:bg-black/60 transition-colors"
                                aria-label="Close popup"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                        <div className="flex flex-col flex-1">
                            <div className="bg-card/80 px-5 pt-4 pb-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-bold text-foreground leading-tight">
                                            {collection.label || 'Untitled Collection'}
                                        </h2>
                                        {collection.description && (
                                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                {collection.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Layers3 className="size-3" />
                                        {totalTopics} topic{totalTopics !== 1 ? 's' : ''}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5">
                                        <ExternalLink className="size-3" />
                                        {totalLinks} link{totalLinks !== 1 ? 's' : ''}
                                    </span>
                                    {creator && (
                                        <span className="inline-flex items-center gap-1.5">
                                            <User className="size-3" />
                                            {creator}
                                        </span>
                                    )}
                                </div>

                                {/* Topic filter chips */}
                                {collection.nodes.length > 1 && (
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => setActiveSection(null)}
                                            className={cn(
                                                'px-2.5 py-1 rounded-full text-xs font-medium transition-colors border',
                                                activeSection === null
                                                    ? 'bg-foreground text-background border-foreground'
                                                    : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40'
                                            )}
                                        >
                                            All
                                        </button>
                                        {collection.nodes.map(section => (
                                            <button
                                                key={section.id}
                                                onClick={() =>
                                                    setActiveSection(prev => (prev === section.id ? null : section.id))
                                                }
                                                className={cn(
                                                    'px-2.5 py-1 rounded-full text-xs font-medium transition-colors border',
                                                    activeSection === section.id
                                                        ? 'bg-foreground text-background border-foreground'
                                                        : 'bg-transparent text-muted-foreground border-border hover:border-foreground/40'
                                                )}
                                            >
                                                {section.title || 'Untitled'}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="px-5 py-4 space-y-6">
                                {visibleSections.length > 0 ? (
                                    visibleSections.map(section => {
                                        const links = section.items.filter(i => i.type === 'link')
                                        if (links.length === 0) return null
                                        return (
                                            <div key={section.id} className="space-y-2">
                                                {collection.nodes.length > 1 && (
                                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                        {section.title || 'Untitled Section'}
                                                    </h3>
                                                )}
                                                <div className="space-y-2">
                                                    {links.map(item => (
                                                        <LinkPreview key={item.id} link={item} />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No links in this collection yet.
                                    </p>
                                )}
                            </div>

                            {/* Action toolbar */}
                            <div className="sticky bottom-0 left-0 bg-card px-5 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0">
                                <Link
                                    href={href}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
                                >
                                    Open full page →
                                </Link>

                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleShare}>
                                        <Share2 className="size-3.5 mr-1.5" />
                                        Share
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleSave}>
                                        <Heart className="size-3.5 mr-1.5" />
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="link"
                                        asChild>
                                        <Link href={editHref}>
                                            Publish yours
                                            <ArrowRight className="size-3.5 ml-1.5" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}