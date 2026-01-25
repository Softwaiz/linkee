'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable'
import { Plus, Layers, Save, GripVertical, ChevronRight } from 'lucide-react'
import { SectionBlock } from './section-block'
import { SectionDialog, LinkDialog, TextDialog } from './dialog'
import { EditorHeader } from './header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '../ui/label'
import { CSS } from '@dnd-kit/utilities'
import { createCollection } from '@/actions/collections/create'
import { toast } from 'sonner'
import { navigate } from 'rwsdk/client'
import { CollectionInput, Group, GroupItem, LinkItem, TextItem } from '@/validations/collection/create'
import { Collection } from '@db/index'
import { updateCollection } from '@/actions/collections/update'

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

const initialPage: Partial<CollectionInput> = {
  id: generateId(),
  label: 'My Resource Collection',
  description: 'A curated list of valuable resources',
  nodes: [],
}

export function PageEditor({ collection }: { collection?: Collection }) {

  const storageKey = `collection.${collection?.id ?? "new"}.draft`;

  const [page, setPage] = useState<Partial<CollectionInput>>(() => {
    if (collection) {
      return collection;
    }

    if (globalThis.localStorage) {
      let previous = localStorage.getItem(storageKey);
      if (previous) {
        return JSON.parse(previous);
      }
    }
    return initialPage;
  });

  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeDragType, setActiveDragType] = useState<'section' | 'item' | null>(null)

  const [sectionDialogOpen, setSectionDialogOpen] = useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [textDialogOpen, setTextDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Group | null>(null)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)
  const [editingText, setEditingText] = useState<TextItem | null>(null)
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null)

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout>(null);
  const [savingDraft, setSavingDraft] = useState(false);

  ///auto save to localstorage
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setSavingDraft(true);
      localStorage.setItem(storageKey, JSON.stringify(page));
      setSavingDraft(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }, 5000);
  }, [storageKey, page]);

  const activeSection = useMemo(() => {
    if (!activeSectionId) return null
    return page.nodes!.find((s) => s.id === activeSectionId) || null
  }, [page.nodes, activeSectionId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)

    const isSection = page.nodes!.some((s) => s.id === active.id)
    setActiveDragType(isSection ? 'section' : 'item')
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find if active is an item and over is a different section
    const activeSection = page.nodes!.find((s) =>
      s.items.some((item) => item.id === activeId)
    )
    const overSection = page.nodes!.find(
      (s) => s.id === overId || s.items.some((item) => item.id === overId)
    )

    if (!activeSection || !overSection || activeSection.id === overSection.id) {
      return
    }

    // Move item between sections
    setPage((prev) => {
      const activeItem = activeSection.items.find((item) => item.id === activeId)
      if (!activeItem) return prev

      return {
        ...prev,
        nodes: prev.nodes!.map((section) => {
          if (section.id === activeSection.id) {
            return {
              ...section,
              items: section.items.filter((item) => item.id !== activeId),
            }
          }
          if (section.id === overSection.id) {
            const overIndex = section.items.findIndex((item) => item.id === overId)
            const newItems = [...section.items]
            if (overIndex >= 0) {
              newItems.splice(overIndex, 0, activeItem)
            } else {
              newItems.push(activeItem)
            }
            return { ...section, items: newItems }
          }
          return section
        }),
      }
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setActiveDragType(null)

    if (!over || active.id === over.id) return

    const activeId = active.id as string
    const overId = over.id as string

    // Check if dragging sections
    const activeIsSection = page.nodes!.some((s) => s.id === activeId)
    const overIsSection = page.nodes!.some((s) => s.id === overId)

    if (activeIsSection && overIsSection) {
      setPage((prev) => {
        const oldIndex = prev.nodes!.findIndex((s) => s.id === activeId)
        const newIndex = prev.nodes!.findIndex((s) => s.id === overId)
        return {
          ...prev,
          nodes: arrayMove(prev.nodes!, oldIndex, newIndex),
        }
      })
      return
    }

    // Reorder items within a section
    const section = page.nodes!.find(
      (s) =>
        s.items.some((item) => item.id === activeId) &&
        s.items.some((item) => item.id === overId)
    )

    if (section) {
      setPage((prev) => ({
        ...prev,
        nodes: prev.nodes!.map((s) => {
          if (s.id !== section.id) return s
          const oldIndex = s.items.findIndex((item) => item.id === activeId)
          const newIndex = s.items.findIndex((item) => item.id === overId)
          return {
            ...s,
            items: arrayMove(s.items, oldIndex, newIndex),
          }
        }),
      }))
    }
  }

  // Section handlers
  const handleAddSection = () => {
    setEditingSection(null)
    setSectionDialogOpen(true)
  }

  const handleEditSection = (section: Group) => {
    setEditingSection(section)
    setSectionDialogOpen(true)
  }

  const handleSaveSection = (data: { title: string; description: string }) => {
    if (editingSection) {
      setPage((prev) => ({
        ...prev,
        nodes: prev.nodes!.map((s) =>
          s.id === editingSection.id ? { ...s, ...data } : s
        ),
      }))
    } else {
      let id = generateId();
      const newSection: Group = {
        id: id,
        title: data.title,
        description: data.description,
        items: [],
      }
      setPage((prev) => ({
        ...prev,
        nodes: [...prev.nodes!, newSection],
      }));
      setActiveSectionId(id);
    }
    setEditingSection(null)
  }

  const handleDeleteSection = (sectionId: string) => {
    setPage((prev) => ({
      ...prev,
      nodes: prev.nodes!.filter((s) => s.id !== sectionId),
    }))
  }

  // Link handlers
  const handleAddLink = (sectionId: string) => {
    setTargetSectionId(sectionId)
    setEditingLink(null)
    setLinkDialogOpen(true)
  }

  const handleEditLink = (link: LinkItem, sectionId: string) => {
    setTargetSectionId(sectionId)
    setEditingLink(link)
    setLinkDialogOpen(true)
  }

  const handleSaveLink = (data: { url: string; title: string; description: string }) => {
    if (!targetSectionId) return

    if (editingLink) {
      setPage((prev) => ({
        ...prev,
        nodes: prev.nodes!.map((s) =>
          s.id === targetSectionId
            ? {
              ...s,
              items: s.items.map((item) =>
                item.id === editingLink.id ? { ...item, ...data } : item
              ),
            }
            : s
        ),
      }))
    } else {
      const newLink: LinkItem = {
        id: generateId(),
        type: 'link',
        url: data.url,
        title: data.title || data.url,
        description: data.description,
      }
      setPage((prev) => ({
        ...prev,
        nodes: prev.nodes!.map((s) =>
          s.id === targetSectionId ? { ...s, items: [...s.items, newLink] } : s
        ),
      }))
    }
    setEditingLink(null)
    setTargetSectionId(null)
  }

  // Text handlers
  const handleAddText = (sectionId: string) => {
    setTargetSectionId(sectionId)
    setEditingText(null)
    setTextDialogOpen(true)
  }

  const handleEditText = (text: TextItem, sectionId: string) => {
    setTargetSectionId(sectionId)
    setEditingText(text)
    setTextDialogOpen(true)
  }

  const handleSaveText = (data: { content: string }) => {
    if (!targetSectionId) return

    if (editingText) {
      setPage((prev) => ({
        ...prev,
        nodes: prev.nodes!.map((s) =>
          s.id === targetSectionId
            ? {
              ...s,
              items: s.items.map((item) =>
                item.id === editingText.id ? { ...item, ...data } : item
              ),
            }
            : s
        ),
      }))
    } else {
      const newText: TextItem = {
        id: generateId(),
        type: 'text',
        content: data.content,
      }
      setPage((prev) => ({
        ...prev,
        nodes: prev.nodes!.map((s) =>
          s.id === targetSectionId ? { ...s, items: [...s.items, newText] } : s
        ),
      }))
    }
    setEditingText(null)
    setTargetSectionId(null)
  }

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setPage((prev) => ({
      ...prev,
      nodes: prev.nodes!.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((item) => item.id !== itemId) }
          : s
      ),
    }))
  }

  const handleEditItem = (item: GroupItem, sectionId: string) => {
    if (item.type === 'link') {
      handleEditLink(item, sectionId)
    } else {
      handleEditText(item, sectionId)
    }
  }

  const [saving, setSaving] = useState(false);

  const handleUpdateCollection = useCallback(() => {
    setSaving(true);
    let toastId = `collection.${collection?.id!}.save`;
    toast.loading("Saving", { id: toastId });

    updateCollection(collection?.id!, page)
      .then((value) => {
        if (value.success && value.updated) {
          toast.success(
            "Saved !",
            {
              id: toastId,
              description: value.message,
              action: <Button onClick={() => {
                navigate(value.updated?.id || '');
              }}>View</Button>
            });
        }
        else {
          toast.error("Your collection was not saved.",
            {
              id: toastId,
              description: value.message,
            });
        }
      })
      .finally(() => {
        setSaving(false);
      })
  }, [page, collection]);

  const handleSaveCollection = useCallback(() => {
    if (collection) {
      return handleUpdateCollection();
    }

    setSaving(true);
    toast.loading("Saving", { id: "collection.save" });
    createCollection(page)
      .then((value) => {
        if (value.success && value.created) {
          toast.success(
            "Saved !",
            {
              id: "collection.save",
              description: value.message,
              action: <Button onClick={() => {
                navigate(value.created?.id || '');
              }}>View</Button>
            })
          localStorage.removeItem('collection.draft');
        }
        else {
          toast.error("Your collection was not saved.",
            {
              id: "collection.save",
              description: value.message,
            });
        }
      })
      .finally(() => {
        setSaving(false);
      })
  }, [page, collection]);

  return (
    <div className="min-h-dvh bg-neutral-200">
      <EditorHeader />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="container mx-auto grid grid-cols-5 py-4 min-h-[80vh]">
          <div className="relative col-span-2 bg-neutral-50 shadow-sm rounded-l-lg space-y-4 border border-r border-neutral-200">

            <div className="w-full h-full absolute top-0 left-0 z-0 rounded-l-lg overflow-hidden hidden">
              <img
                src="/images/background-pink.png"
                alt="background image"
                className='w-full h-full object-contain object-center'
              />
            </div>

            <div className="relative z-1 w-full min-h-full bg-neutral-900 text-neutral-200 px-4 py-8 space-y-4 backdrop-blur-2xl rounded-l-lg">
              <div className="space-y-4">
                <div className='space-y-2'>
                  <Label className='popover-foreground'>Name this collection</Label>
                  <Input
                    value={page.label}
                    onChange={(e) => setPage((prev) => ({ ...prev, label: e.target.value }))}
                    placeholder="Page Title"
                    className="bg-white/10 border-0 text-3xl font-bold placeholder:text-muted-foreground focus-visible:ring-0"
                  />
                </div>
                <div className='space-y-2'>
                  <Label>What resources does it contain ?</Label>
                  <Textarea
                    value={page.description || ''}
                    onChange={(e) =>
                      setPage((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Add a description for your page..."
                    className="bg-white/10 border-0 placeholder:text-muted-foreground/50 focus-visible:ring-0"
                    rows={6}
                  />
                </div>
              </div>
              <SortableContext
                items={page.nodes!.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <ReorderableSectionList
                  sections={page.nodes!}
                  onSectionSelect={(id) => {
                    setActiveSectionId(id);
                  }}
                />
              </SortableContext>
              <DragOverlay>
                {activeId && activeDragType === 'section' && (
                  <div className="rounded-md border border-accent/50 bg-card/80 p-3 shadow-2xl backdrop-blur space-y-2">
                    <div className="h-8 w-full animate-pulse rounded-lg bg-neutral-400" />
                    <div className="h-6 w-full animate-pulse rounded-lg bg-neutral-400" />
                  </div>
                )}
                {activeId && activeDragType === 'item' && (
                  <div className="rounded-md border border-accent/50 bg-card p-3 shadow-2xl backdrop-blur space-y-2">
                    <div className="h-8 w-full animate-pulse rounded bg-neutral-400" />
                    <div className="h-6 w-full animate-pulse rounded bg-neutral-400" />
                    <div className="h-4 w-full animate-pulse rounded bg-neutral-400" />
                  </div>
                )}
              </DragOverlay>

              {page.nodes!.length > 0 && (
                <Button
                  onClick={handleAddSection}
                  variant="default"
                  className="mt-4 w-full"
                >
                  <Plus className="size-4" />
                  Add Section
                </Button>
              )}
            </div>
          </div>
          <div className="col-span-3 bg-white shadow-sm rounded-r-lg min-h-100">
            {
              activeSection && <SectionBlock
                key={activeSection.id}
                section={activeSection}
                onEditSection={() => handleEditSection(activeSection)}
                onDeleteSection={() => handleDeleteSection(activeSection.id)}
                onAddLink={() => handleAddLink(activeSection.id)}
                onAddText={() => handleAddText(activeSection.id)}
                onEditItem={(item) => handleEditItem(item, activeSection.id)}
                onDeleteItem={(itemId) => handleDeleteItem(activeSection.id, itemId)}
              />
            }
            {!activeSection && page.nodes!.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 py-16">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                  <Layers className="size-6 text-muted-foreground" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-foreground">
                  No sections yet
                </h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  Create your first section to start organizing your links
                </p>
                <Button onClick={handleAddSection}>
                  <Plus className="size-4" />
                  Add Section
                </Button>
              </div>
            )}
          </div>
          <div className="col-span-5 flex flex-row items-center justify-end my-4">
            <Button
              title='Save this collection'
              className='text-sm flex flex-row items-center justify-center gap-2'
              disabled={saving}
              onClick={() => {
                handleSaveCollection();
              }}>
              {
                saving ? <>
                  Save this collection
                </> : <>
                  Save this collection
                  <Save className="size-4" /></>
              }
            </Button>
          </div>
        </div>
      </DndContext>

      <SectionDialog
        open={sectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        section={editingSection}
        onSave={handleSaveSection}
      />
      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        link={editingLink}
        onSave={handleSaveLink}
      />
      <TextDialog
        open={textDialogOpen}
        onOpenChange={setTextDialogOpen}
        text={editingText}
        onSave={handleSaveText}
      />
    </div>
  )
}

function ReorderableSectionList({ sections, onSectionSelect }: { sections: Group[], onSectionSelect: (sectionId: string) => void }) {

  return <div className='w-full space-y-2'>
    {sections.map((section) => (
      <DraggableSectionCard key={section.id} section={section} onClick={() => {
        onSectionSelect(section.id)
      }} />
    ))}
  </div>
}

function DraggableSectionCard({ section, onClick }: { section: Group, onClick: () => void }) {

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return <div
    ref={setSortableRef}
    key={section.id}
    className="w-full bg-white/10 text-white p-4 rounded-md flex flex-row items-center justify-start gap-1 transition-all duration-75 hover:bg-white/20">
    <button
      {...attributes}
      {...listeners}
      className="shrink-0 cursor-grab touch-none text-muted-foreground opacity-100 transition-opacity active:cursor-grabbing"
    >
      <GripVertical size={14} className='text-white' />
    </button>
    <div className="grow flex flex-col items-start justify-start gap-1">
      <p className='font-semibold text-sm text-left'>{section.title}</p>
      <p className='text-xs text-left text-white/50'>{section.description}</p>
    </div>
    <button
      className="p-2 rounded-full"
      onClick={onClick}
    >
      <ChevronRight size={14} />
    </button>
  </div>
}