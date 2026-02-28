'use client'
import { useState, useMemo } from 'react'
import { CollectionCard } from './collection-card'
import { AddCollectionCard } from './add-collection-card'
import { navigate } from 'rwsdk/client'
import { Collection } from '@db/index'
import { toast } from 'sonner'
import { deleteCollection } from '@/actions/collections/delete'
import { duplicate } from '@/actions/collections/duplicate'

export function CollectionsGrid({
  items,
  hideAdd = false,
  /** The authenticated user's ID. When provided, any collection with matching userId renders in owner mode. */
  currentUserId,
  layoutPrefix = "kit",
}: {
  items: Collection[]
  hideAdd?: boolean
  currentUserId?: string
  layoutPrefix?: string
}) {
  const [collections, setCollections] = useState<Collection[]>(items)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections
    const query = searchQuery.toLowerCase()
    return collections.filter(
      c => c.label.toLowerCase().includes(query) || c.description?.toLowerCase().includes(query)
    )
  }, [collections, searchQuery])

  const handleDelete = (id: string) => {
    let toastId = `delete.${id}`;
    toast.loading("Deleting collection ...", { id: toastId });

    deleteCollection(id)
      .then((value) => {
        if (value.success) {
          toast.success("Deleted !", {
            id: toastId,
            description: value.message
          });
          window.location.reload();
        }
        else {
          toast.error("Error.", {
            id: toastId,
            description: value.message
          });
        }
      });
  }

  const handleDuplicate = (id: string) => {
    let toastId = `duplicate.${id}`;
    toast.loading("Duplicating collection ...", { id: toastId });

    duplicate(id)
      .then((value) => {
        if (value.success) {
          toast.success("Duplicated !", {
            id: toastId,
            description: value.message
          });
          navigate(window.location.pathname);
        }
        else {
          toast.error("Error.", {
            id: toastId,
            description: value.message
          });
        }
      });
  }

  return (
    <main className="w-full">
      <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!hideAdd && <AddCollectionCard
          onClick={() => {
            navigate("/collections/new");
          }}
        />}
        {filteredCollections.map(collection => (
          <CollectionCard
            layoutPrefix={layoutPrefix}
            key={`${layoutPrefix}-${collection.id}`}
            collection={collection}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        ))}
      </div>

      {filteredCollections.length === 0 && searchQuery && (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">No collections found for "{searchQuery}"</p>
        </div>
      )}
    </main>
  )
}
