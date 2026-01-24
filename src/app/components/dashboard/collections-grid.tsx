'use client'
import { useState, useMemo } from 'react'
import type { Page } from '@/lib/types'
import { CollectionCard } from './collection-card'
import { AddCollectionCard } from './add-collection-card'
import { DashboardHeader } from './dashboard-header'
import { navigate } from 'rwsdk/client'

export function CollectionsGrid({ items }: { items: Page[] }) {
  const [collections, setCollections] = useState<Page[]>(items)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections
    const query = searchQuery.toLowerCase()
    return collections.filter(
      c => c.title.toLowerCase().includes(query) || c.description?.toLowerCase().includes(query)
    )
  }, [collections, searchQuery])

  const handleDelete = (id: string) => {
    setCollections(prev => prev.filter(c => c.id !== id))
  }

  const handleDuplicate = (id: string) => {
    const collection = collections.find(c => c.id === id)
    if (!collection) return
    const duplicate: Page = {
      ...structuredClone(collection),
      id: crypto.randomUUID(),
      title: `${collection.title} (copy)`
    }
    setCollections(prev => [duplicate, ...prev])
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
