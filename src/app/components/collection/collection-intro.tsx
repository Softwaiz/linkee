'use client'

import { ArrowLeft, Pencil, Share2, MoreHorizontal, SquareStack, LinkIcon, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Collection } from '@db/index'
import { toast } from 'sonner'

interface CollectionHeaderProps {
  collection: Collection;
  readOnly?: boolean
}

export function CollectionIntroduction({ collection, readOnly }: CollectionHeaderProps) {
  const totalLinks = collection.nodes.reduce(
    (acc, section) => acc + section.items.filter(item => item.type === 'link').length,
    0
  )
  const totalSections = collection.nodes.length

  return (
    <>
      {collection.banner && (
        <>
          <div className="w-full aspect-video overflow-hidden rounded-md">
            <img
              src={collection.banner}
              alt={collection.label}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="container mx-auto relative min-h-50">
            <div className="w-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 flex flex-col items-center justify-center">
              <div className="mb-6 inline-flex size-30 lg:size-36 items-center justify-center rounded-2xl border-8 border-white bg-white shadow-lg overflow-hidden text-accent">
                {
                  collection.picture && <img
                    src={collection.picture}
                    alt={collection.label}
                    className="w-full h-full object-cover object-center rounded-md"
                  />
                }
              </div>
              <h1 className='text-2xl text-center'>{collection.label}</h1>
              <p className="mx-auto text-pretty text-base text-muted-foreground text-center">{collection.description}</p>
              <div className="text-center mt-4">
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
            </div>
          </div>
        </>
      )}
    </>
  )
}
