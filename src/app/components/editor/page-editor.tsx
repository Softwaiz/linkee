'use client'

import { ChangeEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { Plus, Layers, Save, GripVertical, Pen, Brush, Info, List, Lock } from 'lucide-react'
import { SectionBlock } from './blocks/section'
import { SectionDialog, LinkDialog, TextDialog } from './dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '../ui/label'
import { CSS } from '@dnd-kit/utilities'
import { createCollection } from '@/actions/collections/create'
import { toast } from 'sonner'
import { navigate } from 'rwsdk/client'
import { CollectionInput, CollectionSettingsInput, Group, GroupItem, LinkItem, TextItem } from "@/validations/collection/create"
import { SettingsArea } from "../collection/settings-dialog"
import { Collection } from '@db/index'
import { updateCollection } from '@/actions/collections/update'
import { checkSlugAvailability } from '@/actions/collections/check-slug'
import { Loader2, Check, X } from 'lucide-react'
import { useFileURL } from '@/hooks/useBrowserFile'
import { uploadCollectionBanner, uploadCollectionPicture } from '@/actions/upload'
import { cn } from '@/lib/utils'
import { useDimensions } from '@/hooks/useDimensions'
import { AnimatePresence, easeIn, easeOut, motion } from 'motion/react'
import { CollectionSettings } from '@db/index'
import { useDebounce } from '@/hooks/useDebounce'

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

function pageCache(id: string) {
  let key = `collection.${id}.draft`
  let cache = {
    get: () => {
      console.log("getting cache")
      return localStorage.getItem(key)
    },
    set: (value: string) => {
      console.log("setting cache")
      return localStorage.setItem(key, value)
    },
    clear: () => {
      console.log("clearing cache")
      return localStorage.removeItem(key)
    }
  }
  return cache;
}

const initialPage: () => Partial<CollectionInput> = () => ({
  id: generateId(),
  picture: "https://placehold.co/120x120/2b73ff/d4edff/png",
  banner: "https://placehold.co/416x240/0e37a1/d4edff/png",
  label: 'My Resource Collection',
  description: 'A curated list of valuable resources',
  nodes: [
    {
      id: generateId(),
      title: "First Topic",
      description: "This is the first topic in the collection. You can add links to this topic by clicking the add link button.",
      items: []
    }
  ],
  slug: '',
})

export type PrefillLink = {
  url: string
  title: string
  description?: string
  image?: string
  favicon?: string
}

export function PageEditor({ header, footer, collection, settings: initialSettings, prefillLink }: {
  header?: ReactNode,
  footer?: ReactNode,
  collection?: Collection,
  settings?: Partial<CollectionSettings>,
  prefillLink?: PrefillLink
}) {

  const cachedPage = useMemo(() => {
    return pageCache(collection?.id ?? "new");
  }, [collection?.id]);

  const [settings, setSettings] = useState<Partial<CollectionSettings>>(() => {
    return initialSettings ?? {
      visibility: 'public',
    }
  });

  const [page, setPage] = useState<Partial<CollectionInput>>(() => {
    if (collection) {
      return collection as CollectionInput;
    }
    if (!prefillLink && globalThis.localStorage) {
      let previous = cachedPage.get();
      if (previous) {
        return JSON.parse(previous) as Partial<CollectionInput>;
      }
    }
    if (prefillLink) {
      return {
        ...initialPage(),
        nodes: [
          {
            id: generateId(),
            title: 'Links',
            description: 'Your curated links',
            items: [
              {
                id: generateId(),
                type: 'link' as const,
                url: prefillLink.url,
                title: prefillLink.title || prefillLink.url,
                description: prefillLink.description || '',
                image: prefillLink.image,
                favicon: prefillLink.favicon,
              },
            ],
          },
        ],
      };
    }
    return initialPage();
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
  const [savingDraft, setSavingDraft] = useState(false);

  // Slug validation state
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugMessage, setSlugMessage] = useState<string>("");
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const slugDebouncer = useDebounce(500);
  const persistenceDebounce = useDebounce(5000);

  const selectedPicture = useFileURL();
  const selectedBanner = useFileURL();

  const [saving, setSaving] = useState(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const pictureInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (page.slug && collection && page.slug === collection?.slug) {
      setSlugAvailable(true);
      slugDebouncer.cancel();
      return;
    }

    if (!page.slug) {
      return;
    }

    // reset state
    setSlugAvailable(null);
    setSlugMessage("");
    setIsCheckingSlug(false);

    slugDebouncer.delay(async () => {
      setIsCheckingSlug(true);
      setSlugMessage("Checking availability...");
      const result = await checkSlugAvailability(page.slug!, collection?.id);
      setSlugAvailable(result.available);
      setSlugMessage(result.message || "");
      setIsCheckingSlug(false);
    });

    return () => {
      slugDebouncer.cancel();
    }
  }, [page.slug, collection?.slug, collection?.id]);

  useEffect(() => {
    persistenceDebounce.delay(() => {
      setSavingDraft(true);
      cachedPage.set(JSON.stringify(page));
      setSavingDraft(false);
    });

    return () => {
      persistenceDebounce.cancel();
    }
  }, [cachedPage, page]);

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

  const handleSaveLink = (data: { url: string; title: string; description: string; image?: string; favicon?: string }) => {
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
        image: data.image,
        favicon: data.favicon,
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

  const handleUpdateCollection = useCallback(async () => {
    setSaving(true);
    let toastId = `collection.${collection?.id!}.save`;
    toast.loading("Saving", { id: toastId });
    let pictureUrl = page.picture ?? '';
    let bannerUrl = page.banner ?? '';

    setSaving(true);
    toast.loading("Saving", { id: toastId });

    if (selectedPicture.file) {

      toast.loading("Uploading picture", { id: toastId });
      let data = new FormData();
      data.set("file", selectedPicture.file);

      await uploadCollectionPicture(data)
        .then((v) => {
          if (v.success && v.url) {
            pictureUrl = v.url
          }
        });
    }
    if (selectedBanner.file) {
      toast.loading("Uploading banner", { id: toastId });
      let data = new FormData();
      data.set("file", selectedBanner.file);

      await uploadCollectionBanner(data)
        .then((v) => {
          if (v.success && v.url) {
            bannerUrl = v.url
          }
        });
    }

    toast.loading("Saving collection", { id: toastId });

    await updateCollection(
      collection?.id!,
      {
        ...page,
        picture: pictureUrl,
        banner: bannerUrl,
        settings: settings as any
      }
    )
      .then((value) => {
        if (value.success && value.updated) {
          cachedPage.clear();
          toast.success(
            "Saved !",
            {
              id: toastId,
              description: value.message,
              action: <Button onClick={() => {
                navigate(value.path!);
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
  }, [cachedPage, page, collection, selectedPicture, selectedBanner, settings]);

  const handleSaveCollection = useCallback(async () => {
    if (collection) {
      return handleUpdateCollection();
    }

    let pictureUrl = '';
    let bannerUrl = '';

    setSaving(true);
    toast.loading("Saving", { id: "collection.save" });

    if (selectedPicture.file) {

      toast.loading("Uploading picture", { id: "collection.save" });
      let data = new FormData();
      data.set("file", selectedPicture.file);

      await uploadCollectionPicture(data)
        .then((v) => {
          if (v.success && v.url) {
            pictureUrl = v.url
          }
        });
    }
    if (selectedBanner.file) {

      toast.loading("Uploading banner", { id: "collection.save" });
      let data = new FormData();
      data.set("file", selectedBanner.file);

      await uploadCollectionBanner(data)
        .then((v) => {
          if (v.success && v.url) {
            bannerUrl = v.url
          }
        });
    }

    toast.loading("Saving collection", { id: "collection.save" });
    await createCollection({
      ...page,
      picture: pictureUrl,
      banner: bannerUrl,
      settings: settings as any
    })
      .then((value) => {
        console.log("post create:", value);
        if (value.success && value.created) {
          cachedPage.clear()
          toast.success(
            "Saved !",
            {
              id: "collection.save",
              description: value.message,
              action: <Button onClick={() => {
                navigate(value.path!);
              }}>View</Button>
            })
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
  }, [page, cachedPage, collection, selectedPicture, selectedBanner, settings]);

  const handlePictureChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.currentTarget.files?.item(0);
    if (file) {
      selectedPicture.load(file);
    }
  }, []);

  const handleBannerChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.currentTarget.files?.item(0);
    if (file) {
      selectedBanner.load(file);
    }
  }, []);

  const slugRef = useRef<HTMLDivElement | null>(null);
  const dimensions = useDimensions(slugRef);

  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (globalThis.location) {
      setOrigin(globalThis.location.origin);
    }
  }, []);

  const urlPrefix = useMemo(() => {
    return origin + "/kit/";
  }, [origin]);

  const handleSettingsUpdate = useCallback((newSettings: CollectionSettingsInput) => {
    setSettings(newSettings);
  }, []);

  return (
    <div className="min-h-dvh">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-12 gap-4 min-h-[80vh]">
          <div className="col-span-12 sticky top-0 z-2 border-b border-input flex flex-row items-center justify-end gap-2 bg-white/40 backdrop-blur-lg px-1 py-0.5">
            <div className="grow overflow-hidden">
              {header}
            </div>
            <Button
              size="sm"
              title='Save this collection'
              className='text-sm flex flex-row items-center justify-center gap-2'
              disabled={saving || slugAvailable === false}
              onClick={() => {
                handleSaveCollection();
              }}>
              {
                saving ? <>
                  Saving
                  <Loader2 className="size-4 animate-spin" />
                </> : <>
                  Save
                  <Save className="size-4" /></>
              }
            </Button>
          </div>

          <SectionCard className="col-span-12 w-full text-foreground">
            <div className="w-full flex flex-row items-center justify-start">
              <h1 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                <span className='text-muted-foreground inline-block pr-2'>
                  <Info className="size-4" />
                </span>
                About this collection
              </h1>
            </div>
            <div className="w-full space-y-4">
              <div className='space-y-2'>
                <Label className='popover-foreground'>Name this collection</Label>
                <Input
                  value={page.label}
                  onChange={(e) => setPage((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="Page Title"
                  className="bg-white/10 placeholder:text-muted-foreground focus-visible:ring-0"
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
                  className="bg-white/10 placeholder:text-muted-foreground/50 focus-visible:ring-0"
                  rows={6}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard className="col-span-12 lg:col-span-4">
            <div className="w-full flex flex-row items-center justify-between">
              <h1 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                <span className='text-muted-foreground inline-block pr-2'>
                  <List className="size-4" />
                </span>
                Manage topics
              </h1>
              <Button
                onClick={handleAddSection}
                variant="default"
                size="sm"
              >
                <Plus className="size-4" />
                Add a topic
              </Button>
            </div>
            <div className="w-full space-y-4">
              <SortableContext
                items={page.nodes!.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <ReorderableSectionList
                  active={activeSectionId ?? ''}
                  sections={page.nodes!}
                  onSectionSelect={(id) => {
                    setActiveSectionId(id);
                  }}
                />
              </SortableContext>
              <DragOverlay>
                {activeId && activeDragType === 'section' && (
                  <div className="rounded-md border border-accent/50 bg-card/80 p-3 shadow-2xl backdrop-blur space-y-2">
                    <div className="h-8 w-full animate-pulse rounded-lg bg-neutral-400/80" />
                    <div className="h-6 w-full animate-pulse rounded-lg bg-neutral-400/60" />
                  </div>
                )}
                {activeId && activeDragType === 'item' && (
                  <div className="rounded-md border border-accent/50 bg-card p-3 shadow-2xl backdrop-blur space-y-2">
                    <div className="h-8 w-full animate-pulse rounded bg-neutral-400/80" />
                    <div className="h-6 w-full animate-pulse rounded bg-neutral-400/60" />
                    <div className="h-4 w-full animate-pulse rounded bg-neutral-400/40" />
                  </div>
                )}
              </DragOverlay>
            </div>
          </SectionCard>

          <div className="col-span-12 lg:col-span-8 space-y-4 bg-card rounded-md border border-input">
            <div className="w-full min-h-100 relative overflow-hidden">
              <AnimatePresence>
                {
                  activeSection && <motion.section
                    key={activeSection.id}
                    initial={{
                      y: -10,
                      opacity: 0,
                      position: 'absolute'
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      position: "relative",
                      transition: {
                        duration: .25,
                        ease: easeIn
                      }
                    }}
                    exit={{
                      y: -10,
                      opacity: 0,
                      position: 'absolute',
                      transition: {
                        duration: .1,
                        ease: easeOut
                      }
                    }}>
                    <SectionBlock
                      section={activeSection}
                      onEditSection={() => handleEditSection(activeSection)}
                      onDeleteSection={() => handleDeleteSection(activeSection.id)}
                      onAddLink={() => handleAddLink(activeSection.id)}
                      onAddText={() => handleAddText(activeSection.id)}
                      onEditItem={(item) => handleEditItem(item, activeSection.id)}
                      onDeleteItem={(itemId) => handleDeleteItem(activeSection.id, itemId)}
                    />
                  </motion.section>
                }
              </AnimatePresence>
              {!activeSection && page.nodes!.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-sm py-16">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-100">
                    <Layers className="size-6 text-secondary-500" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium text-foreground">
                    No topics yet.
                  </h3>
                  <p className="mb-6 text-sm text-muted-foreground">
                    Create your first topic to start organizing your links.
                  </p>
                  <Button onClick={handleAddSection}>
                    <Plus className="size-4" />
                    Add topic
                  </Button>
                </div>
              )}
              {
                !activeSection && page.nodes!.length > 0 && (
                  <div className="flex flex-col items-center justify-center rounded-xl py-16">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-100">
                      <Layers className="size-6 text-secondary-500" />
                    </div>
                    <h3 className="mb-1 text-lg font-medium text-center text-foreground">
                      No topic selected.
                    </h3>
                    <p className="mb-1 text-sm font-medium text-center text-muted-foreground">
                      Select or add a topic to start adding links.
                    </p>
                  </div>
                )
              }
            </div>
          </div>

          <SectionCard className="col-span-12 rounded-sm">
            <h1 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
              <span className='text-muted-foreground inline-block pr-2'>
                <Brush className="size-4" />
              </span>
              Layout & appearance
            </h1>
            <div className="w-full relative">
              <div className="w-full flex flex-col md:flex-row items-center justify-start gap-4">
                <div className="basis-full w-full md:w-auto md:basis-1/3 space-y-4 order-2 md:order-1">
                  <div className="flex flex-col items-start justify-start space-y-2">
                    <Label>Page Banner</Label>
                    <p className='text-sm text-muted-foreground'>
                      The collection banner will be displayed at the top of the page and on collection cards.
                    </p>
                  </div>
                  <input
                    hidden
                    type="file"
                    name=""
                    id="banner-input"
                    accept='image/png, image/webp, image/jpeg'
                    ref={bannerInputRef}
                    onChange={handleBannerChange}
                  />
                  <Button
                    className="w-full md:w-auto"
                    onClick={() => bannerInputRef.current?.click()}
                    variant="outline"
                  >
                    <Pen className="size-4" />
                    Select an image
                  </Button>
                </div>
                <img
                  className='w-full md:w-auto md:grow h-60 aspect-video object-cover object-center rounded-md order-1 md:order-2'
                  src={selectedBanner.url ?? page.banner ?? initialPage().banner}
                  alt="Banner image" />
              </div>
            </div>
          </SectionCard>

          {settings && <SectionCard className="col-span-12">
            <h1 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
              <span className="inline-block pr-2">
                <Lock className="size-4" />
              </span>
              Security & Privacy
            </h1>
            <SettingsArea
              collection={collection}
              settings={settings as any}
              hasDangerZone={Boolean(collection)}
              onSettingsUpdate={handleSettingsUpdate}
            >
              <motion.div layout className='space-y-2'>
                <AnimatePresence>
                  <Label className='popover-foreground'>Customize the link</Label>
                  <div className="relative flex flex-row items-center gap-2 border border-input rounded-md">
                    <div
                      ref={slugRef}
                      className='absolute top-0 left-0 bottom-0 pl-2 pr-1 max-w-1/5 md:max-w-3/5 overflow-hidden flex flex-row items-center justify-start border-r border-input'>
                      <span
                        className='text-sm text-nowrap truncate opacity-75'
                      >
                        {urlPrefix}
                      </span>
                    </div>
                    <Input
                      value={page.slug || ''}
                      onChange={(e) => setPage((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="my-awesome-tag"
                      style={{
                        paddingLeft: `${(dimensions.dimensions?.width ?? 0) + 8}px`
                      }}
                      className={
                        cn(
                          "shadow-none",
                          "bg-white/10 placeholder:text-neutral-400 focus-visible:ring-0 pr-10 border-0",
                          slugAvailable === false ? 'text-red-400' : slugAvailable === true ? 'text-green-400' : ''
                        )
                      }
                    />
                    <motion.div layout className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {isCheckingSlug && <Loader2 className="animate-spin size-4 text-muted-foreground" />}
                      {!isCheckingSlug && slugAvailable === true && <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: .1, ease: easeOut }}>
                        <Check className="size-4 text-green-500" />
                      </motion.div>
                      }
                      {!isCheckingSlug && slugAvailable === false && <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: .1, ease: easeOut }}>
                        <X className="size-4 text-red-500" />
                      </motion.div>
                      }
                    </motion.div>
                  </div>
                  {slugMessage && (
                    <p className={`text-xs ${slugAvailable === false ? 'text-red-400' : slugAvailable === true ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {slugMessage}
                    </p>
                  )}
                  {page.slug && <p className="text-sm text-muted-foreground">
                    Your collection will be accessible at <span className="underline text-blue-500">{urlPrefix}{page.slug}</span>
                  </p>
                  }
                </AnimatePresence>
              </motion.div>
            </SettingsArea>
          </SectionCard>
          }
        </div>
      </DndContext >
      {
        footer && <div className="w-full mt-4">
          {
            footer
          }
        </div>
      }
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
    </div >
  )
}

function ReorderableSectionList({ sections, onSectionSelect, active }: { active: string; sections: Group[], onSectionSelect: (sectionId: string) => void }) {

  return <div className='w-full space-y-2'>
    {sections.map((section) => (
      <DraggableSectionCard
        key={section.id}
        section={section}
        active={active === section.id}
        onClick={() => {
          onSectionSelect(section.id)
        }}
      />
    ))}
  </div>
}

function SectionCard(props: { className?: string, children: [first: ReactNode, second: ReactNode] }) {
  return <div className={
    cn(
      "col-span-12 relative w-full bg-card rounded-md border border-input text-foreground",
      props.className
    )
  }>
    <div className="w-full flex flex-row items-center justify-start p-2 md:p-3 lg:p-4">
      {props.children[0]}
    </div>
    <hr />
    <div className="w-full p-2 md:p-3 lg:p-4">
      {props.children[1]}
    </div>
  </div>
}

function DraggableSectionCard({ active, section, onClick }: { active: boolean; section: Group, onClick: () => void }) {

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
    ref={(el) => {
      setSortableRef(el);
      setDroppableRef(el);
    }}
    key={section.id}
    onClick={() => {
      onClick()
    }}
    data-active={active}
    className={
      cn(
        "w-full border border-neutral-300 text-neutral-900 p-2",
        "rounded-md flex flex-row items-center justify-start gap-2 transition-all duration-75",
        "hover:border-transparent hover:bg-secondary-200/20 hover:text-secondary-700 cursor-pointer",
        active && "border bg-secondary-500/5 text-secondary-700 border-transparent"
      )
    }>
    <button
      {...attributes}
      {...listeners}
      className="shrink-0 cursor-grab touch-none text-muted-foreground opacity-100 transition-opacity active:cursor-grabbing"
    >
      <GripVertical size={14} className='text-inherit' />
    </button>
    <div className="grow flex flex-col items-start justify-start gap-1">
      <p className='font-semibold text-sm text-left'>{section.title}</p>
      <p className='text-xs text-left text-inherit opacity-50'>{section.description}</p>
    </div>
  </div>
}