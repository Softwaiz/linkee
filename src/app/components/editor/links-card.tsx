'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import type { LinkItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface LinkCardProps {
  item: LinkItem
  onEdit: () => void
  onDelete: () => void
}

export function LinkCard({ item, onEdit, onDelete }: LinkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id } as any)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-200',
        'hover:border-accent/50 hover:bg-card/80'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab touch-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>

      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-secondary">
        {item.favicon ? (
          <img
            src={item.favicon || "/placeholder.svg"}
            alt=""
            className="size-5 rounded-sm"
            crossOrigin="anonymous"
          />
        ) : (
          <ExternalLink className="size-4 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-foreground">
          {item.title || 'Untitled Link'}
        </h4>
        {item.description && (
          <p className="truncate text-xs text-muted-foreground">
            {item.description}
          </p>
        )}
        <p className="truncate text-xs text-blue-700 underline">{item.url}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
