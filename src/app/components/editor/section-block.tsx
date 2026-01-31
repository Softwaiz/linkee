'use client'
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus, Pencil, Trash2, Link2, Type, Link, Text } from 'lucide-react'
import { LinkCard } from './links-card'
import { TextBlock } from './text-block'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Group, GroupItem } from '@/validations/collection/create'

interface SectionBlockProps {
  section: Group
  onEditSection: () => void
  onDeleteSection: () => void
  onAddLink: () => void
  onAddText: () => void
  onEditItem: (item: GroupItem) => void
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
        'group/section relative transition-all duration-200 space-y-2',
        isDragging && 'opacity-50 ring-2 ring-accent/50',
        isOver && 'ring-2 ring-accent/30',
        "pb-10"
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

        <div className="flex items-center gap-1">
          <div className="flex flex-row items-center justify-center gap-2">
            <Button
              size="sm"
              variant="outline"
              title="Edit this collection"
              onClick={onEditSection}
            >
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              title="Delete this collection"
              onClick={onDeleteSection}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
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
        <div className="w-full flex flex-row items-center justify-end gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onAddLink();
            }}>
            <Link size={16} />
            <span className='text-sm'>
              Add a link
            </span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onAddText();
            }}>
            <Type size={16} />
            <span className="text-sm">
              Add Text
            </span>
          </Button>
        </div>

        {section.items.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border/50 text-sm text-muted-foreground">
            Drop items here or click Add below
          </div>
        )}
      </div>
    </div>
  )
}
