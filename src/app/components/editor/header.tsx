'use client'
import { ArrowLeft, Eye, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EditorHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/home">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </a>
          <div className="h-5 w-px bg-border" />
          <span className="text-sm font-medium text-foreground">
            Linkee
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Eye className="size-4" />
            Preview
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
