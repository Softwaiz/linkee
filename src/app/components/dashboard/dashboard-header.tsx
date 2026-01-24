'use client'
import { Settings, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DashboardHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function DashboardHeader({ searchQuery, onSearchChange }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <a href="/" className="text-lg font-semibold text-foreground">
          Linkee
        </a>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 bg-muted/50 pl-9 focus:bg-background"
            />
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
