'use client'

import { MoreHorizontal, ExternalLink, Layers, Link as LinkIcon, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Collection } from '@db/index'

interface CollectionCardProps {
  collection: Collection;
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export function CollectionCard({ collection, onDelete, onDuplicate }: CollectionCardProps) {
  const totalLinks = collection.nodes.reduce(
    (acc, section) => acc + section.items.filter(item => item.type === 'link').length,
    0
  )
  const totalSections = collection.nodes.length

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
      {collection.picture && (
        <div className="w-full aspect-video overflow-hidden">
          <img
            src={collection.picture}
            alt={collection.label}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-3 lg:p-5 flex flex-col flex-1">
        <div className="mb-2 flex items-start justify-between">
          {!collection.picture && (
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Layers className="size-5" />
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="absolute top-4 right-4 size-8 transition-all"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={`/collections/${collection.slug ?? collection.id}`} className="flex items-center gap-2">
                  <ExternalLink className="size-4" />
                  Open
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={`/shared/${collection.slug ?? collection.id}`} className="flex items-center gap-2">
                  <Share className="size-4" />
                  Share
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(collection.id)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(collection.id)}
                className="bg-destructive text-destructive-foreground focus:text-destructive-foreground focus:bg-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <a href={`/collections/${collection.slug ?? collection.id}`} className="flex flex-1 flex-col">
          <h3 className="mb-1 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
            {collection.label || 'Untitled Collection'}
          </h3>
          <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">
            {collection.description || 'No description'}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <LinkIcon className="size-3.5" />
              {totalLinks} {totalLinks === 1 ? 'link' : 'links'}
            </span>
            <span className="flex items-center gap-1.5">
              <Layers className="size-3.5" />
              {totalSections} {totalSections === 1 ? 'section' : 'sections'}
            </span>
          </div>
        </a>
      </div>
    </div>
  )
}
