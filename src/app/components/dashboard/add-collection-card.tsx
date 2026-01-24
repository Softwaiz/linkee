'use client'

import { Plus } from 'lucide-react'

interface AddCollectionCardProps {
  onClick: () => void
}

export function AddCollectionCard({ onClick }: AddCollectionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-transparent p-5 transition-all duration-200 hover:border-accent hover:bg-accent/5"
    >
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all duration-200 group-hover:bg-accent group-hover:text-accent-foreground">
        <Plus className="size-6" />
      </div>
      <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        New Collection
      </span>
    </button>
  )
}
