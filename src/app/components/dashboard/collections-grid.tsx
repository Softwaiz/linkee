'use client'
import { useState, useMemo } from 'react'
import type { Page } from '@/lib/types'
import { CollectionCard } from './collection-card'
import { AddCollectionCard } from './add-collection-card'
import { DashboardHeader } from './dashboard-header'
import { navigate } from 'rwsdk/client'
import { Collection } from '@db/index'
import { toast } from 'sonner'
import { deleteCollection } from '@/actions/collections/delete'
import { duplicate } from '@/actions/collections/duplicate'

export function CollectionsGrid({ items }: { items: Collection[] }) {
  const [collections, setCollections] = useState<Page[]>(items)
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
    <div className="min-h-screen bg-background">
      <DashboardHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Your Collections</h1>
          <p className="mt-1 text-muted-foreground">
            {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AddCollectionCard
            onClick={() => {
              navigate("/collections/new");
            }}
          />
          {filteredCollections.map(collection => (
            <CollectionCard
              key={collection.id}
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

    </div>
  )
}
