'use client'
import { ArrowLeft, Layers, Link as LinkIcon, MoreHorizontal, Pencil, Share2, SquareStack } from 'lucide-react'
import type { Page } from '@/lib/types'
import { CollectionIntroduction } from './collection-intro'
import { Button } from '@/components/ui/button'
import { SectionPreview } from './section-preview'
import { Collection } from '@db/index'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

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

      <div className="w-full sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <header className="container mx-auto flex flex-row items-center justify-between">
          <div className="flex h-16 items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <a href={readOnly ? "/" : "/home"}>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <ArrowLeft className="size-4" />
                  <span className="hidden sm:inline">Back to home</span>
                </Button>
              </a>
              <div className="hidden h-6 w-px bg-border sm:block" />
              <span className="hidden text-sm font-medium sm:block">{collection.label || 'Untitled'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!readOnly && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/shared/${collection.slug ?? collection.id}`)
                      .then(() => {
                        toast.success("Link copied", { id: `${collection.id}.copy_link` });
                      });
                  }}
                >
                  <Share2 className="size-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button size="sm" className="gap-2" asChild>
                  <a href={`/collections/${collection.id}/edit`}>
                    <Pencil className="size-4" />
                    Edit
                  </a>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {readOnly && (
              <Button size="sm" asChild>
                <a href="/collections/new">
                  Create Yours
                  <SquareStack className="size-4" />
                </a>
              </Button>
            )}
          </div>
        </header>
      </div>

      <div className="container mx-auto grid grid-cols-12 py-4 gap-4">

        <div className="col-span-12 lg:col-span-4">
          <div className="w-full lg:sticky lg:top-20 lg:left-0">
            <CollectionIntroduction
              readOnly={readOnly}
              collection={collection} />
              
            {collection.nodes.length > 0 && !readOnly && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent" asChild>
                  <a href={`/collections/${collection.slug ?? collection.id}/edit`}>
                    <Pencil className="size-4" />
                    Edit this collection
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
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

        </div>

      </div>
    </div>
  )
}
