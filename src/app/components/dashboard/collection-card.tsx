'use client'
import { Layers3, ExternalLink } from 'lucide-react'
import { Collection } from '@db/index'
import { useState } from 'react'
import { motion } from 'motion/react'
import { CollectionPopup } from '../collection/collection-popup'

interface CollectionCardProps {
  collection: Collection;
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  layoutPrefix?: string
}

export function CollectionCard({ collection, onDelete, onDuplicate, layoutPrefix }: CollectionCardProps) {
  const [open, setOpen] = useState(false)
  const totalLinks = collection.nodes.reduce(
    (acc, section) => acc + section.items.filter(item => item.type === 'link').length,
    0
  )
  const totalTopics = collection.nodes.length

  return (
    <>
      <motion.button
        layoutId={`${layoutPrefix}-card-${collection.id}`}
        onClick={() => setOpen(true)}
        className="w-full text-left group relative bg-card/5 border border-card hover:bg-card/50 duration-200 transition-all rounded-md flex flex-col items-center justify-start cursor-pointer"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
      >
        <motion.img
          layoutId={`${layoutPrefix}-card-banner-${collection.id}`}
          src={collection.banner ?? "https://fastly.picsum.photos/id/402/600/180.jpg?hmac=tGbMRulUvCgU0agW7HvyKaaWH6bEnU0-b-UefhnMIHs"}
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
        </div>
      </motion.button>

      <CollectionPopup
        collection={collection}
        layoutId={`${layoutPrefix}-card-${collection.id}`}
        bannerLayoutId={`${layoutPrefix}-card-banner-${collection.id}`}
        isOpen={open}
        isOwner={true}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
