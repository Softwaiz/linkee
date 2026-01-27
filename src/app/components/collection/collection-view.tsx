'use client'
import { Layers, Link as LinkIcon, Pencil } from 'lucide-react'
import type { Page } from '@/lib/types'
import { CollectionHeader } from './collection-header'
import { Button } from '@/components/ui/button'
import { SectionPreview } from './section-preview'
import { Collection } from '@db/index'

interface CollectionViewProps {
  collection: Collection;
}

export function CollectionView({ collection, readOnly }: CollectionViewProps & { readOnly?: boolean }) {
  const totalLinks = collection.nodes.reduce(
    (acc, section) => acc + section.items.filter(item => item.type === 'link').length,
    0
  )
  const totalSections = collection.nodes.length

  return (
    <div className="min-h-screen bg-background">
      <CollectionHeader
        readOnly={readOnly}
        collectionId={collection.id}
        collectionSlug={collection.slug}
        banner={collection.banner}
        title={collection.label} />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <Layers className="size-8" />
          </div>
          <h1 className="mb-3 text-balance text-4xl font-bold tracking-tight text-foreground">
            {collection.label || 'Untitled Collection'}
          </h1>
          {collection.description && (
            <p className="mx-auto mb-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              {collection.description}
            </p>
          )}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <LinkIcon className="size-4" />
              {totalLinks} {totalLinks === 1 ? 'link' : 'links'}
            </span>
            <span className="flex items-center gap-2">
              <Layers className="size-4" />
              {totalSections} {totalSections === 1 ? 'section' : 'sections'}
            </span>
          </div>
        </div>

        {collection.nodes.length > 0 ? (
          <div className="space-y-12">
            {collection.nodes.map((section) => (
              <SectionPreview key={section.id} section={section} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
              <Layers className="size-6" />
            </div>
            <h3 className="mb-2 font-medium text-foreground">No sections yet</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              {readOnly ? 'This collection is empty.' : 'Start building your collection by adding sections and links'}
            </p>
            {!readOnly && (
              <Button asChild>
                <a href={`/collections/${collection.slug ?? collection.id}/edit`}>
                  <Pencil className="mr-2 size-4" />
                  Start Editing
                </a>
              </Button>
            )}
          </div>
        )}
        {collection.nodes.length > 0 && !readOnly && (
          <div className="mt-16 flex justify-center">
            <Button variant="outline" size="lg" className="gap-2 bg-transparent" asChild>
              <a href={`/collections/${collection.slug ?? collection.id}/edit`}>
                <Pencil className="size-4" />
                Edit this collection
              </a>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
