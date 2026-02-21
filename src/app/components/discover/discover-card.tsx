'use client'
import { MoreHorizontal, Layers, Link as LinkIcon, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Collection } from '@db/index'
import { Link } from '../link'

interface DiscoverCardProps {
  collection: Collection
}

export function DiscoverCard({ collection }: DiscoverCardProps) {
  const totalLinks = collection.nodes.reduce(
    (acc, section) => acc + section.items.filter(item => item.type === 'link').length,
    0
  )
  const totalSections = collection.nodes.length

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
      {collection.banner && (
        <Link href={`/collections/${collection.slug || collection.id}`} className="relative aspect-16/10 overflow-hidden">
          <img
            src={collection.banner || "/placeholder.svg"}
            alt={collection.label}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}
      <div className="absolute right-3 top-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="size-8 rounded-full bg-[#5865F2] text-white shadow-md hover:bg-[#4752c4]"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2">
              <Bookmark className="size-4" />
              Save to bookmarks
            </DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link href={`/collections/${collection.slug || collection.id}`} className="flex flex-1 flex-col p-5">
        {!collection.banner && (
          <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Layers className="size-5" />
          </div>
        )}

        <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
          {collection.label || 'Untitled Collection'}
        </h3>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {collection.description || 'No description'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-accent">
          <span className="flex items-center gap-1.5">
            <LinkIcon className="size-3.5" />
            {totalLinks} {totalLinks === 1 ? 'link' : 'links'}
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="size-3.5" />
            {totalSections} {totalSections === 1 ? 'section' : 'sections'}
          </span>
        </div>
      </Link>
    </div>
  )
}

export function PublicDiscoverCard({ collection }: DiscoverCardProps) {
  const totalLinks = collection.nodes.reduce(
    (acc, section) => acc + section.items.filter(item => item.type === 'link').length,
    0
  )
  const totalSections = collection.nodes.length

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
      {/* Cover Image */}
      {collection.banner && (
        <Link href={`/kit/${collection.slug || collection.id}`} className="relative aspect-16/10 overflow-hidden">
          <img
            src={collection.banner || "/placeholder.svg"}
            alt={collection.label}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}

      {/* Menu Button */}
      <div className="absolute right-3 top-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="size-8 rounded-full bg-[#5865F2] text-white shadow-md hover:bg-[#4752c4]"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2">
              <Bookmark className="size-4" />
              Save to bookmarks
            </DropdownMenuItem>
            <DropdownMenuItem>Share</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link href={`/kit/${collection.slug || collection.id}`} className="flex flex-1 flex-col p-5">
        {!collection.banner && (
          <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Layers className="size-5" />
          </div>
        )}

        <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
          {collection.label || 'Untitled Collection'}
        </h3>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {collection.description || 'No description'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-accent">
          <span className="flex items-center gap-1.5">
            <LinkIcon className="size-3.5" />
            {totalLinks} {totalLinks === 1 ? 'link' : 'links'}
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="size-3.5" />
            {totalSections} {totalSections === 1 ? 'section' : 'sections'}
          </span>
        </div>
      </Link>
    </div>
  )
}
