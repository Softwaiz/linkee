'use client'

import { Layers3, ExternalLink, User } from 'lucide-react'
import { Collection } from '@db/index'
import { HTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { CollectionPopup } from './popup'
import { useMyReactions } from '@/hooks/use-reactions'

interface CollectionCardProps {
  layoutId?: string;
  bannerLayoutId?: string;
  collection: Collection & {
    userAlias?: string | null
    userFullName?: string | null
  }
  isOwner?: boolean
}

export function CollectionCard({ collection, layoutId = "", bannerLayoutId = "", isOwner = false }: CollectionCardProps) {
  const [open, setOpen] = useState(false)
  const totalLinks = collection.nodes.reduce(
    (acc, section) => acc + section.items.filter(item => item.type === 'link').length,
    0
  )
  const totalTopics = collection.nodes.length
  const creator = collection.userAlias ? `@${collection.userAlias}` : collection.userFullName || null

  const reactions = useMyReactions(collection.id);
  return (
    <>
      <motion.button
        layoutId={layoutId}
        onClick={() => setOpen(true)}
        className="w-full text-left group bg-card/5 border border-card hover:bg-card/50 duration-200 transition-all rounded-md flex flex-col items-center justify-start cursor-pointer"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
      >
        <div className="grow w-full flex flex-col items-start justify-start gap-1">
          <motion.img
            layoutId={bannerLayoutId}
            src={collection.banner || "https://fastly.picsum.photos/id/402/600/180.jpg?hmac=tGbMRulUvCgU0agW7HvyKaaWH6bEnU0-b-UefhnMIHs"}
            alt={collection.label}
            className="w-full object-cover object-center rounded-t-md h-46"
          />
          <div className="w-full flex flex-col items-start justify-start px-3 py-4">
            <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-foreground/80">
              {collection.label || 'Untitled Collection'}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <p>
                <span className="text-xs inline-flex items-center mr-2">
                  <Layers3 className="size-3 inline-block mr-2" aria-hidden="true" />
                  {totalTopics} topic{totalTopics !== 1 ? 's' : ''}
                </span>
                <span className="text-xs inline-flex items-center">
                  <ExternalLink className="size-3 inline-block mr-2" aria-hidden="true" />
                  {totalLinks} link{totalLinks !== 1 ? 's' : ''}
                </span>
              </p>
            </div>
            <p className="mt-1 w-full text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {collection.description || 'No description'}
            </p>
            {creator && (
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-card rounded-full p-1.5">
                  <User className="size-3.5" aria-hidden="true" />
                </span>
                <span className="text-xs">{creator}</span>
              </div>
            )}
          </div>
        </div>
      </motion.button>

      <CollectionPopup
        layoutId={layoutId}
        bannerLayoutId={bannerLayoutId}
        collection={collection}
        isOpen={open}
        isOwner={isOwner}
        onClose={() => setOpen(false)}
        loadingUserReactions={reactions.isLoading}
        initialIsSaved={reactions.isSaved}
        initialIsLiked={reactions.isLiked}
      />
    </>
  )
}


export function CollectionCardLayout(props: HTMLAttributes<HTMLDivElement>) {
  return <div
    {...props}
    className={cn(
      "group relative flex flex-col overflow-hidden rounded-xl",
      "border border-border",
      "bg-linear-to-b from-background-800/80 via-background-700 to-background-800",
      "transition-all duration-200",
      "hover:bg-card hover:shadow-lg hover:shadow-accent/5 shadow-sm",
      props.className
    )}>
    {props.children}
  </div>
}