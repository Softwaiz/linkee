'use client'

import type { TextItem } from '@/lib/types'

interface TextPreviewProps {
  text: TextItem
}

export function TextPreview({ text }: TextPreviewProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-secondary/30 p-4">
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
        {text.content}
      </p>
    </div>
  )
}
