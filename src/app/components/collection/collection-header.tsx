'use client'

import { ArrowLeft, Pencil, Share2, MoreHorizontal, SquareStack } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CollectionHeaderProps {
  collectionId: string
  title: string
  readOnly?: boolean
}

export function CollectionHeader({ collectionId, title, readOnly }: CollectionHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-start gap-4">
        <div className="flex items-center gap-3">
          <a href={readOnly ? "/" : "/home"}>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to home</span>
            </Button>
          </a>
          <div className="hidden h-6 w-px bg-border sm:block" />
          <span className="hidden text-sm font-medium sm:block">{title || 'Untitled'}</span>
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Share2 className="size-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button size="sm" className="gap-2" asChild>
                <a href={`/collections/${collectionId}/edit`}>
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
      </div>
    </header>
  )
}
