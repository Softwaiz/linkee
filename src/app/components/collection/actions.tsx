'use client'
import { Heart, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toggleReaction } from '@/actions/collections/react'
import { useOptimistic, useTransition, useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { navigate } from 'rwsdk/client'
import { useIdentity } from '@/providers/identity'

interface CollectionActionsProps {
    collectionId: string
    initialLikes: number
    initialSaves: number
    initialIsLiked: boolean
    initialIsSaved: boolean
}

export function CollectionActions({
    collectionId,
    initialLikes,
    initialSaves,
    initialIsLiked,
    initialIsSaved
}: CollectionActionsProps) {
    const { user } = useIdentity()
    const [likes, setLikes] = useState(initialLikes)
    const [saves, setSaves] = useState(initialSaves)
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [isSaved, setIsSaved] = useState(initialIsSaved)

    const [_, startTransition] = useTransition()

    const handleAction = async (type: 'like' | 'save') => {
        if (!user) {
            toast.error('Please login to react to collections')
            navigate('/signin')
            return;
        }

        // Optimistic update
        if (type === 'like') {
            const newIsLiked = !isLiked
            setIsLiked(newIsLiked)
            setLikes(prev => newIsLiked ? prev + 1 : prev - 1)
        } else {
            const newIsSaved = !isSaved
            setIsSaved(newIsSaved)
            setSaves(prev => newIsSaved ? prev + 1 : prev - 1)
        }

        startTransition(async () => {
            try {
                const result = await toggleReaction(collectionId, type)
                if (!result.success) {
                    throw new Error(result.message)
                }
            } catch (error) {
                // Revert on error
                if (type === 'like') {
                    setIsLiked(!isLiked)
                    setLikes(prev => !isLiked ? prev + 1 : prev - 1)
                } else {
                    setIsSaved(!isSaved)
                    setSaves(prev => !isSaved ? prev + 1 : prev - 1)
                }
                toast.error('Failed to update reaction')
            }
        })
    }

    return (
        <div className="flex items-center gap-2 mt-4">
            <Button
                variant="ghost"
                size="sm"
                className={cn("gap-2 hover:bg-red-50 hover:text-red-600", isLiked && "text-red-600")}
                onClick={() => handleAction('like')}
            >
                <Heart className={cn("size-4", isLiked && "fill-current")} />
                <span>{likes}</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                className={cn("gap-2 hover:bg-blue-50 hover:text-blue-600", isSaved && "text-blue-600")}
                onClick={() => handleAction('save')}
            >
                <Bookmark className={cn("size-4", isSaved && "fill-current")} />
                <span>{saves}</span>
            </Button>
        </div>
    )
}
