'use client'

import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Pencil, Trash2, Link2, Type, Save } from 'lucide-react'
import type { Section, SectionItem } from '@/lib/types'
import { LinkCard } from './links-card'
import { TextBlock } from './text-block'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface SectionBlockProps {
  section: Section
  onEditSection: () => void
  onDeleteSection: () => void
  onAddLink: () => void
  onAddText: () => void
  onEditItem: (item: SectionItem) => void
  onDeleteItem: (itemId: string) => void
}

export function SectionBlock({
  section,
  onEditSection,
  onDeleteSection,
  onAddLink,
  onAddText,
  onEditItem,
  onDeleteItem,
}: SectionBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id, data: { type: 'section' } })

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-${section.id}`,
    data: { sectionId: section.id },
  })

  return (
    <div
      className={cn(
        'group/section transition-all duration-200 space-y-2',
        isDragging && 'opacity-50 ring-2 ring-accent/50',
        isOver && 'ring-2 ring-accent/30'
      )}
    >
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3">
          <div>
            <h3 className="text-lg text-foreground">
              {section.title || 'Untitled Section'}
            </h3>
            {section.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {section.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/section:opacity-100">
          <button
            title="Edit this collection"
            onClick={onEditSection}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Pencil className="size-4" />
          </button>
          <button
            title="Delete this collection"
            onClick={onDeleteSection}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <hr className='w-full bg-neutral-100' />

      <div ref={setDroppableRef} className="space-y-2 p-4">
        <SortableContext
          items={section.items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {section.items.map((item) =>
            item.type === 'link' ? (
              <LinkCard
                key={item.id}
                item={item}
                onEdit={() => onEditItem(item)}
                onDelete={() => onDeleteItem(item.id)}
              />
            ) : (
              <TextBlock
                key={item.id}
                item={item}
                onEdit={() => onEditItem(item)}
                onDelete={() => onDeleteItem(item.id)}
              />
            )
          )}
        </SortableContext>

        {section.items.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border/50 text-sm text-muted-foreground">
            Drop items here or click Add below
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
            >
              <Plus className="size-4" />
              Add Item
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem onClick={onAddLink}>
              <Link2 className="size-4" />
              Add Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onAddText}>
              <Type className="size-4" />
              Add Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
