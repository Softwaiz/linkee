'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, Type } from 'lucide-react'
import type { TextItem } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TextBlockProps {
  item: TextItem
  onEdit: () => void
  onDelete: () => void
}

export function TextBlock({ item, onEdit, onDelete }: TextBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-200',
        'hover:border-accent/50 hover:bg-card/80',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-accent/50'
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 flex-shrink-0 cursor-grab touch-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>

      <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-secondary">
        <Type className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
          {item.content || 'Empty text block'}
        </p>
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
