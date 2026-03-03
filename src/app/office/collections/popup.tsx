import { useEscapeEffect } from "@/hooks/useEscapeEffect";
import { useScrollLockerEffect } from "@/hooks/useScrollLocker";
import { Collection } from "@db/index";
import { AnimatePresence } from "motion/react";
import { useRef, useState } from "react"
import { toast } from "sonner";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRight, Bookmark, ExternalLink, Layers3, Pencil, Share2, User, X } from "lucide-react";
import { LinkPreview } from "@/components/collection/link-preview";
import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/ui/custom-popup";

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
    loadingUserReactions?: boolean
    initialIsSaved?: boolean
    initialIsLiked?: boolean
}

export function CollectionPopup({
    layoutId: layoutId = "collection",
    bannerLayoutId = "banner",
    collection,
    isOpen,
    isOwner,
    onClose,
    loadingUserReactions = false,
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
        <Popup
            layoutId={layoutId}
            backdropLayoutId={bannerLayoutId}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex flex-col flex-1">
                <div className="bg-card text-card-foreground px-5 pt-4 pb-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold leading-tight">
                                {collection.label || 'Untitled Collection'}
                            </h2>
                            {collection.description && (
                                <p className="mt-1 text-sm text-card-foreground/80 line-clamp-2">
                                    {collection.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-xs text-card-foreground flex-wrap">
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
                                        : 'bg-background text-foreground border-border hover:border-foreground/40'
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
                                            : 'bg-background text-foreground border-border hover:border-foreground/40'
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
                <div className="sticky bottom-0 left-0 bg-card px-5 py-4 border-t border-border flex items-center justify-between gap-3 shrink-0">
                    <Link
                        href={href}
                        className="text-xs text-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
                    >
                        Open full page <ArrowRight className='ml-2 size-3 inline-block' />
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
                                onClick={() => { }}
                            >
                                <Bookmark className={cn('size-3.5 mr-1.5', isSaved && 'fill-current')} />
                                {isSaved ? 'Saved' : 'Save'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Popup>
    )
}
